;(function init() {
    if (document.querySelector('#pertDialog')) {
        alert('You already have a PERT Dialog in this Window')
        return
    }

    // Newer versions of JIRA has a div with attribute contenteditable="true" as the comment box
    // Older versions of JIRA has an element with id `tinymce` inside an iframe as the comment box (eg. KMD)
    const commentBox =
        document
            .querySelector(`iframe[id^="mce_"]`)
            ?.contentWindow.document.getElementById('tinymce') ||
        document.querySelector('[contenteditable="true"]')

    if (!commentBox) {
        alert('Please click on comment box before using PERT bookmarklet.')
        return
    }

    const getSavedPertConfig = function () {
        const savedPertConfig = localStorage.getItem(PERT_STORAGE_KEY)

        if (!savedPertConfig) return {}

        return JSON.parse(savedPertConfig)
    }

    const PERT_STORAGE_KEY = 'pertConfig'
    const savedPertConfig = getSavedPertConfig()
    const VALIDATE_HOUR_MINUTES =
        'pattern="^((\\d*\\.?\\d+)[Mm]?|((\\d*\\.?\\d+)[Hh] ?((\\d*\\.?\\d+)[Mm])?))$" title="Time values can be either hour value (1.5) or hours and minutes (1h 30m)"'

    const pertConfig = {
        comms_deploys_qa_default_percentage:
            savedPertConfig?.comms_deploys_qa_default_percentage || 20,
        code_review_default_percentage:
            savedPertConfig?.code_review_default_percentage || 10,
        automated_tests_default_percentage:
            savedPertConfig?.automated_tests_default_percentage || 0,
        backdrop_blur: savedPertConfig?.backdrop_blur || 'true',
        round_to_next_minutes: savedPertConfig?.round_to_next_minutes || 10,
    }

    /**
     * Convert minute estimate to hours and minutes string
     * eg 130 -> 2h 10m
     *
     * @param {number} minutes estimate in minutes
     * @returns {string} hours and minutes string
     */
    const toTimeString = (minutes) => {
        return `${Math.floor(minutes / 60)}h${
            minutes % 60
                ? ` ${String(Math.floor(minutes % 60)).padStart(2, '0')}m`
                : ''
        }`
    }

    /**
     * Get total of an array of estimates as a hours and minutes string
     *
     * @param {Array} arr Array containing estimates
     * @returns {string} hours and minutes string
     */
    const getTotals = (arr) => {
        return arr.reduce((prev, current) => prev + current, 0)
    }

    /**
     * Round to next closest minutes defined in config
     * if set to 0, don't round
     *
     * @param {number} minutes calculated minutes
     * @returns {number} minutes rounted to next minutes defined in config
     */
    const roundMinutes = (minutes) => {
        const roundToNextMinutes = parseInt(pertConfig.round_to_next_minutes)

        if (!roundToNextMinutes) {
            return minutes
        }

        return Math.ceil(minutes / roundToNextMinutes) * roundToNextMinutes
    }

    /**
     * Get minutes from time value
     * input can be either hour value (1.5) or hour minutes string (1h 30m)
     *
     * @param {String} timeValue hour value (1.5) or hour minutes string (1h 30m)
     * @returns {number} minutes
     */
    const getMinutes = (timeValue) => {
        if (!timeValue) return 0

        const timeValueParts = [
            ...timeValue.matchAll(/(\d+(?:\.\d+)?)+(h|m)/gi),
        ]
        if (timeValueParts.length) {
            // we are dealing with a hour minutes string
            const hours = timeValueParts
                .map((item) =>
                    item.at(-1) === 'h'
                        ? Number(item[0].replace(/h|m/i, ''))
                        : Number(item[0].replace(/h|m/i, '')) / 60
                )
                .reduce((a, b) => a + b)
            return Math.floor(hours * 60)
        } else {
            return Math.floor(Number(timeValue) * 60)
        }
    }

    /**
     * Defaults will be saved in localStorage based on project.
     * Each JIRA board is in a different subdomain.
     * eg <project-name>.atlassian.net
     */
    const pertConfigHtml = `<details>
        <summary style="cursor: pointer;">⚙️ <strong>${
            window.location.hostname.split('.')?.[0].toUpperCase() || ''
        }</strong> PERT defaults</summary>
            <form id="pertConfigForm">
            <table id="pertConfig">
            ${Object.entries(pertConfig)
                .map(
                    ([key, value]) =>
                        `<tr>
                            <td>
                                <label>${key.split('_').join(' ')}</label>
                            </td>
                            <td style="text-align: right">
                                <input name="${key}" required size="5" value="${value}">
                            </td>
                        </tr>`
                )
                .join('')}
            </table>
            <button id="pertConfigSubmit" type="submit">Save Config</button> 
            <small>Saved in LocalStorage and only applicable to this JIRA project.</small>
        </form>
    </details>`

    const PERT_DIALOG_SHADOW = '0px 0px 100px 0px'
    const PERT_DIALOG_WRAPPER_INSET = '0'
    const pertRow = document.createElement('tr')
    const pertRowHTML = `
	<td><b>Task</b><br><input size="20" type="text" name="task" /></td>
	<td><b>Best Case</b><br><input required size="5" ${VALIDATE_HOUR_MINUTES} type="text" name="best" /></td>
	<td><b>Likely</b><br><input required size="5" ${VALIDATE_HOUR_MINUTES} type="text" name="likely" /></td>
	<td><b>Worst Case</b><br><input required size="5" ${VALIDATE_HOUR_MINUTES} type="text" name="worst" /></td>
	<td valign="bottom" style="text-align: right">
		<button type="button" class="pertAddRow">➕</button>
		<button type="button" class="pertRemoveRow">➖</button>
	</td>`

    const pertDialogWrapper = document.createElement('div')
    pertDialogWrapper.style.cssText = `--pertDialogWrapperInset: ${PERT_DIALOG_WRAPPER_INSET};
position: fixed;
z-index: 9999;
display: flex;
justify-content: center;
align-items: center;
${pertConfig.backdrop_blur === 'true' ? 'backdrop-filter: blur(5px);' : ''}
inset: var(--pertDialogWrapperInset);`
    const pertFormHtml = `<div id="pertDialog">
    <button style="float: right" type="button" id="pertToggle">Minimize PERT Dialog</button>
    <div id="pertDialogContent">
    ${pertConfigHtml}
	<form id="pertForm">
        <p>Time values can be either hour value (1.5) or hours and minutes (1h 30m)</p>
        <p>Totals will be rounded to next ${pertConfig.round_to_next_minutes} minutes</p>
		<table>
			<tbody id="pertTableBody"></tbody>
			<tbody>
				<tr>
					<td colspan="4">Solution Design (Scoping / Investigation)</td>
					<td colspan="1" style="text-align: right"><input required size="5" ${VALIDATE_HOUR_MINUTES} type="text" name="scoping" /></td>
				</tr>
            </tbody>
            <tbody>
                <tr><td colspan="5"><small>Use override fields to switch to non percentage based time</small></td></tr>
				<tr>
					<td colspan="2">
                        Comms, Deploys and QA (${pertConfig.comms_deploys_qa_default_percentage}% recommended)
                    </td>
					<td colspan="2" style="text-align: left">
						<input required min="0" max="100" value="${pertConfig.comms_deploys_qa_default_percentage}" step="5" type="range" name="comms_deploys_qa" oninput="this.nextElementSibling.value = this.value"/>
						<output>${pertConfig.comms_deploys_qa_default_percentage}</output>% or 
                    </td>
                    <td style="text-align: right">
                        <input size="5" type="text" ${VALIDATE_HOUR_MINUTES} name="comms_deploys_qa_override" placeholder="override" />
                    </td>
				</tr>
				<tr>
					<td colspan="2">
                        Code review and Fixes (${pertConfig.code_review_default_percentage}% recommended)
                    </td>
                    <td colspan="2" style="text-align: left">
						<input required min="0" max="100" value="${pertConfig.code_review_default_percentage}" step="5" type="range" name="code_review" oninput="this.nextElementSibling.value = this.value"/> 
						<output>${pertConfig.code_review_default_percentage}</output>% or
                    </td>
                    <td style="text-align: right">
                        <input size="5" type="text" ${VALIDATE_HOUR_MINUTES} name="code_review_override" placeholder="override" />
                    </td>
				</tr>
                <tr>
					<td colspan="2">
                        Automated Tests
                    </td>
					<td colspan="2" style="text-align: left">
						<input required min="0" max="100" value="${pertConfig.automated_tests_default_percentage}" step="5" type="range" name="automated_tests" oninput="this.nextElementSibling.value = this.value"/> 
						<output>${pertConfig.automated_tests_default_percentage}</output>% or
                    </td>
                    <td style="text-align: right">
                        <input size="5" type="text" ${VALIDATE_HOUR_MINUTES} name="automated_tests_override" placeholder="override" />
                    </td>
				</tr>
			</tbody>
			<tfoot>
				<tr>	
					<td colspan="5" style="text-align: right">
						<button id="pertSubmit" type="submit">Add to Comment</button>
						<button id="pertCancel" value="cancel" formnovalidate>Cancel</button>
					</td>
				</tr>
			</tfoot>
		</table>
	</form>
    </div>
	</dialog>`
    pertDialogWrapper.innerHTML = pertFormHtml
    document.body.appendChild(pertDialogWrapper)

    const pertDialog = document.getElementById('pertDialog')
    pertDialog.style.cssText = `--pertDialogShadow: ${PERT_DIALOG_SHADOW};
background: white;
padding: 20px;
box-shadow: var(--pertDialogShadow);
border-radius: 10px;
}`
    const pertForm = document.getElementById('pertForm')
    const pertDialogContent = document.getElementById('pertDialogContent')
    const pertTableBody = document.getElementById('pertTableBody')
    const pertValues = []

    // clone row
    pertRow.innerHTML = pertRowHTML
    pertTableBody.appendChild(pertRow)
    // remove the remove button since we don't want to remove a single row
    pertTableBody.querySelector('.pertRemoveRow').hidden = true
    pertDialog.querySelector('[name="task"]').focus()

    /**
     * Add a new estimate row
     *
     * @param {Event} e click event
     * @returns {void}
     */
    const handlePertAddRow = (e) => {
        e.preventDefault()
        const addButton = e.target
        addButton.hidden = true
        // clone a new row
        const newPertRow = document.createElement('tr')
        newPertRow.innerHTML = pertRowHTML
        pertTableBody.appendChild(newPertRow)
        console.log('here')
        // focus new title field
        addButton
            .closest('tr')
            .nextSibling.querySelector('[name="task"]')
            .focus()
    }

    /**
     * Remove estimate row
     *
     * @param {Event} e click event
     * @returns {void}
     */
    const handlePertRemoveRow = (e) => {
        e.preventDefault()
        const removeButton = e.target
        const thisRow = removeButton.closest('tr')
        const previousRow = thisRow.previousElementSibling
        if (thisRow.nextSibling === null) {
            // if previous row is the last row, show add row button
            previousRow.querySelector('.pertAddRow').hidden = false
        }
        thisRow.remove()
    }

    /**
     * Remove popup when clicked on cancel button
     *
     * @param {Event} e click event
     * @returns {void}
     */
    const handlePertCancel = (e) => {
        e.preventDefault()
        pertDialogWrapper.remove()
    }

    /**
     * Show / hide pert dialog
     *
     * @param {Event} e click event
     * @returns {void}
     */
    const handlePertToggle = (e) => {
        e.preventDefault()
        if (pertDialogContent.style.display !== 'none') {
            e.target.textContent = 'Maximise PERT Dialog'
            pertDialogContent.style.display = 'none'
            pertDialogWrapper.style.setProperty(
                '--pertDialogWrapperInset',
                'auto auto 20px 20px'
            )
            pertDialog.style.setProperty('--pertDialogShadow', 'none')
        } else {
            e.target.textContent = 'Minimize PERT Dialog'
            pertDialogContent.style.display = 'block'
            pertDialogWrapper.style.setProperty(
                '--pertDialogWrapperInset',
                PERT_DIALOG_WRAPPER_INSET
            )
            pertDialog.style.setProperty(
                '--pertDialogShadow',
                PERT_DIALOG_SHADOW
            )
        }
    }

    const pertConfigForm = document.getElementById('pertConfigForm')

    /**
     * Attach handlers based on class
     *
     * @param {Event} e click event
     * @returns {void}
     */
    const pertDialogHandlers = (e) => {
        if (e.target && e.target.classList.contains('pertAddRow')) {
            handlePertAddRow(e)
        }

        if (e.target && e.target.classList.contains('pertRemoveRow')) {
            handlePertRemoveRow(e)
        }

        if (e.target && e.target.attributes.id?.value === 'pertCancel') {
            handlePertCancel(e)
        }

        if (e.target && e.target.attributes.id?.value === 'pertToggle') {
            handlePertToggle(e)
        }
    }

    // attach events to document so we can add items dynamically
    document.addEventListener('click', pertDialogHandlers, true)

    pertForm.addEventListener('submit', function (e) {
        e.preventDefault()

        // remove event listeners
        document.removeEventListener('click', pertDialogHandlers, true)
        // remove dialog
        pertDialogWrapper.remove()

        const formData = new FormData(pertForm)

        const pertData = {
            task: formData.getAll('task'),
            best: formData.getAll('best').map((a) => getMinutes(a)),
            likely: formData.getAll('likely').map((a) => getMinutes(a)),
            worst: formData.getAll('worst').map((a) => getMinutes(a)),
            scoping: getMinutes(formData.get('scoping')),
            comms_deploys_qa: parseInt(formData.get('comms_deploys_qa')),
            comms_deploys_qa_override: formData.get(
                'comms_deploys_qa_override'
            ),
            code_review: parseInt(formData.get('code_review')),
            code_review_override: formData.get('code_review_override'),
            automated_tests: parseInt(formData.get('automated_tests')),
            automated_tests_override: formData.get('automated_tests_override'),
        }

        const rowHTML = pertData.task.map((_, index) => {
            const best = toTimeString(pertData.best[index])
            const likely = toTimeString(pertData.likely[index])
            const worst = toTimeString(pertData.worst[index])
            const pert =
                (pertData.best[index] +
                    4 * pertData.likely[index] +
                    pertData.worst[index]) /
                6
            pertValues.push(roundMinutes(pert))
            return `<tr>
			${
                pertData.task[0] === '' && pertData.task.length === 1
                    ? ''
                    : `<td rowspan="1" colspan="1"><p>${pertData.task[index]}</p></td>`
            }
			<td rowspan="1" colspan="1" data-colwidth="115"><p>${best}</p></td>
			<td rowspan="1" colspan="1" data-colwidth="115"><p>${likely}</p></td>
			<td rowspan="1" colspan="1" data-colwidth="115"><p>${worst}</p></td>
			<td rowspan="1" colspan="1" data-colwidth="115"><p>${toTimeString(
                roundMinutes(pert)
            )}</p></td>
		</tr>`
        })

        const pertDevelopmentTotalMinutes = getTotals(pertValues)
        const commsDeploysQaMinutes = pertData.comms_deploys_qa_override
            ? roundMinutes(getMinutes(pertData.comms_deploys_qa_override))
            : roundMinutes(
                  (pertDevelopmentTotalMinutes * pertData.comms_deploys_qa) /
                      100
              )
        const codeReviewMinutes = pertData.code_review_override
            ? roundMinutes(getMinutes(pertData.code_review_override))
            : roundMinutes(
                  (pertDevelopmentTotalMinutes * pertData.code_review) / 100
              )
        const automatedTestsMinutes = pertData.automated_tests_override
            ? roundMinutes(getMinutes(pertData.automated_tests_override))
            : roundMinutes(
                  (pertDevelopmentTotalMinutes * pertData.automated_tests) / 100
              )

        const scopingMinutes = roundMinutes(pertData.scoping)

        const toalEstimate = toTimeString(
            pertDevelopmentTotalMinutes +
                scopingMinutes +
                commsDeploysQaMinutes +
                codeReviewMinutes +
                automatedTestsMinutes
        )

        // clear the message box if it's just the placeholder
        if (commentBox.innerHTML.includes('Add a comment\u2026')) {
            commentBox.innerHTML = ''
        }

        const pertHTML = `<table data-number-column="false">
		<tbody>
			<tr>
				${
                    pertData.task[0] === '' && pertData.task.length === 1
                        ? ''
                        : `<th rowspan="1" colspan="1"><p><strong data-renderer-mark="true">Task</strong></p></th>`
                }
				<th rowspan="1" colspan="1"><p data-renderer-start-pos="4"><strong data-renderer-mark="true">Best Case</strong></p></th>
				<th rowspan="1" colspan="1"><p data-renderer-start-pos="12"><strong data-renderer-mark="true">Likely</strong></p></th>
				<th rowspan="1" colspan="1"><p data-renderer-start-pos="22"><strong data-renderer-mark="true">Worst Case</strong></p></th>
				<th rowspan="1" colspan="1"><p data-renderer-start-pos="31"><strong data-renderer-mark="true">PERT</strong></p></th>
			</tr>
			${rowHTML.join('')}
		</tbody>
	</table>
	<table>
		<tbody>
			<tr>
				<td rowspan="1" colspan="1"><p><strong data-renderer-mark="true">PERT Development Time</strong></p></td>
				<td rowspan="1" colspan="1"><p><strong data-renderer-mark="true">${toTimeString(
                    pertDevelopmentTotalMinutes
                )}</strong></p></td>
			</tr>
            ${
                scopingMinutes
                    ? `
			<tr>
				<td rowspan="1" colspan="1"><p>Solution Design</p></td>
				<td rowspan="1" colspan="1"><p>${toTimeString(scopingMinutes)}</p></td>
			</tr>
            `
                    : ''
            }
            ${
                commsDeploysQaMinutes
                    ? `
			<tr>
				<td rowspan="1" colspan="1"><p>Comms, Deploys and QA</p></td>
				<td rowspan="1" colspan="1"><p>${toTimeString(commsDeploysQaMinutes)}</p></td>
			</tr>
            `
                    : ''
            }
            ${
                codeReviewMinutes
                    ? `
			<tr>
				<td rowspan="1" colspan="1"><p>Code Review and Fixes</p></td>
				<td rowspan="1" colspan="1"><p>${toTimeString(codeReviewMinutes)}</p></td>
			</tr>
            `
                    : ''
            }
            ${
                automatedTestsMinutes
                    ? `
			<tr>
				<td rowspan="1" colspan="1"><p>Automated Tests</p></td>
				<td rowspan="1" colspan="1"><p>${toTimeString(automatedTestsMinutes)}</p></td>
			</tr>
            `
                    : ''
            }
			<tr>
				<td rowspan="1" colspan="1"><p><strong data-renderer-mark="true">Total Estimate</strong></p></td>
				<td rowspan="1" colspan="1">
					<p><strong data-renderer-mark="true">${toalEstimate}</strong></p>
				</td>
			</tr>
		</tbody>
	</table>
	`

        commentBox.innerHTML += pertHTML
    })

    pertConfigForm.addEventListener('submit', function (e) {
        e.preventDefault()

        const configFormData = new FormData(pertConfigForm)
        const configFormDataObject = {}
        ;[...configFormData.entries()].forEach(([key, value]) => {
            configFormDataObject[key] = value
        })

        localStorage.setItem(
            PERT_STORAGE_KEY,
            JSON.stringify(configFormDataObject)
        )

        pertDialogWrapper.remove()
    })
})()
