/**
 * Convert minute estimate to hours and minutes string
 * eg 130 -> 2h 10m
 *
 * @param {number} minutes estimate in minutes
 * @returns {string} hours and minutes string
 */
const toTimeString = (minutes) => {
    return `${Math.floor(minutes / 60)}h${
        minutes % 60 ? ` ${Math.floor(minutes % 60)}m` : ''
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
 * Get minutes from time value
 * input can be either hour value (1.5) or hour minutes string (1h 30m)
 *
 * @param {String} timeValue hour value (1.5) or hour minutes string (1h 30m)
 * @returns {string} minutes
 */
const getMinutes = (timeValue) => {
    if (timeValue.split('').some((word) => ['h', 'm'].includes(word))) {
        const hours = [...timeValue.matchAll(/\d+(h|m)/gi)]
            .map((item) =>
                item[1] === 'h'
                    ? Number(item[0].replace(/h|m/i, ''))
                    : Number(item[0].replace(/h|m/i, '')) / 60
            )
            .reduce((a, b) => a + b)
        return hours * 60
    } else {
        return parseFloat(timeValue) * 60
    }
}

const pertRow = document.createElement('tr')
const pertRowHTML = `
	<td><b>Task</b><br><input size="20" type="text" name="task" /></td>
	<td><b>Best Case</b><br><input required size="5" type="text" name="best" /></td>
	<td><b>Likely</b><br><input required size="5" type="text" name="likely" /></td>
	<td><b>Worst Case</b><br><input required size="5" type="text" name="worst" /></td>
	<td valign="bottom" style="text-align: right">
		<button type="button" class="pertAddRow">➕</button>
		<button type="button" class="pertRemoveRow">➖</button>
	</td>`

const pertDialogWrapper = document.createElement('div')
pertDialogWrapper.innerHTML = `<dialog id="pertDialog">
	<form  id="pertForm" method="dialog">
		<p>Time values can be either hour value (1.5) or hours and minutes (1h 30m)</p>
		<table>
			<tbody id="pertTableBody"></tbody>
			<tbody>
				<tr>
					<td colspan="4">Solution Design (Scoping)</td>
					<td colspan="1"><input required size="5" type="text" name="scoping" /></td>
				</tr>
				<tr>
					<td colspan="3">Comms, Deploys and QA (20% recommended)</td>
					<td colspan="2">
						<input required min="0" max="100" value="20" step="5" type="range" name="comms_deploys_qa" oninput="this.nextElementSibling.value = this.value"/>
						<output>20</output>%
					</td>
				</tr>
				<tr>
					<td colspan="3">Code review and Fixes (10% recommended)</td>
					<td colspan="2">
						<input required min="0" max="100" value="10" step="5" type="range" name="code_review" oninput="this.nextElementSibling.value = this.value"/> 
						<output>10</output>%
					</td>
				</tr>
			</tbody>
			<tfoot>
				<tr>	
					<td colspan="3">
						<button id="pertSubmit" type="submit">Add to Comment</button>
					</td>
					<td colspan="2" style="text-align: right">
						<button value="cancel" formnovalidate>Cancel</button>
					</td>
				</tr>
			</tfoot>
		</table>
	</form>
	</dialog>`
document.body.appendChild(pertDialogWrapper)

const pertDialog = document.getElementById('pertDialog')
const pertForm = document.getElementById('pertForm')
const pertSubmit = document.getElementById('pertSubmit')
const pertTableBody = document.getElementById('pertTableBody')
const pertValues = []

// clone row
pertRow.innerHTML = pertRowHTML
pertTableBody.appendChild(pertRow)
// remove the remove button since we don't want to remove a single row
pertTableBody.querySelector('.pertRemoveRow').hidden = true
// show modal
pertDialog.showModal()

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
    addButton.closest('tr').nextSibling.querySelector('[name="task"]').focus()
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
}

// attach events to document so we can add items dynamically
document.addEventListener('click', pertDialogHandlers, true)

pertDialog.addEventListener('close', function onClose() {
    // remove event listeners
    document.removeEventListener('click', pertDialogHandlers, true)
    // remove dialog
    pertDialog.remove()

    // if its cancrl action, do nothing
    if (pertDialog.returnValue === 'cancel') return

    const formData = new FormData(pertForm)

    const pertData = {
        task: formData.getAll('task'),
        best: formData.getAll('best').map((a) => getMinutes(a)),
        likely: formData.getAll('likely').map((a) => getMinutes(a)),
        worst: formData.getAll('worst').map((a) => getMinutes(a)),
        scoping: getMinutes(formData.get('scoping')),
        comms_deploys_qa: parseInt(formData.get('comms_deploys_qa')),
        code_review: parseInt(formData.get('code_review')),
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
        pertValues.push(pert)
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
                pert
            )}</p></td>
		</tr>`
    })

    const pertDevelopmentTotalMinutes = getTotals(pertValues)
    const commsDeploysQaMinutes =
        (pertDevelopmentTotalMinutes * pertData.comms_deploys_qa) / 100
    const codeReviewMinutes =
        (pertDevelopmentTotalMinutes * pertData.code_review) / 100

    const commentBox = document.querySelector('[contenteditable="true"]')

    // clear the message box if it's just the placeholder
    if (commentBox.innerHTML.includes('Add a comment\u2026')) {
        commentBox.innerHTML = ''
    }

    commentBox.innerHTML += `<table data-number-column="false">
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
				<td rowspan="1" colspan="1"><p>PERT Development Time</p></td>
				<td rowspan="1" colspan="1"><p>${toTimeString(
                    pertDevelopmentTotalMinutes
                )}</p></td>
			</tr>
			<tr>
				<td rowspan="1" colspan="1"><p>Solution Design</p></td>
				<td rowspan="1" colspan="1"><p>${toTimeString(pertData.scoping)}</p></td>
			</tr>
			<tr>
				<td rowspan="1" colspan="1"><p>Comms, Deploys and QA</p></td>
				<td rowspan="1" colspan="1"><p>${toTimeString(commsDeploysQaMinutes)}</p></td>
			</tr>
			<tr>
				<td rowspan="1" colspan="1"><p>Code Review and Fixes</p></td>
				<td rowspan="1" colspan="1"><p>${toTimeString(codeReviewMinutes)}</p></td>
			</tr>
			<tr>
				<td rowspan="1" colspan="1"><p><strong data-renderer-mark="true">Total Estimate</strong></p></td>
				<td rowspan="1" colspan="1">
					<p><strong data-renderer-mark="true">${toTimeString(
                        pertDevelopmentTotalMinutes +
                            pertData.scoping +
                            commsDeploysQaMinutes +
                            codeReviewMinutes
                    )}</strong></p>
				</td>
			</tr>
		</tbody>
	</table>
	`
})
