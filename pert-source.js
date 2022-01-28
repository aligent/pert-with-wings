/**
 * Convert minute estimate to hours and minutes string 
 * eg 130 -> 2h 10m
 * 
 * @param {number} minutes estimate in minutes
 * @returns {string} hours and minutes string 
 */
const toTimeString = minutes => {
	return `${Math.floor(minutes/60)}h${minutes % 60 ? ` ${minutes % 60}m`:""}`
}

/**
 * Get total of an array of estimates as a hours and minutes string
 * 
 * @param {Array} arr Array containing estimates
 * @returns {string} hours and minutes string 
 */
const getTotals = arr => {
	return toTimeString(arr.reduce((prev, current) => prev + current, 0))
}

const pertRow = document.createElement('tr');
const pertRowHTML = `
	<td><b>Task</b><br><input size="20" type="text" name="task" /></td>
	<td><b>Optimistic</b><br><input required size="5" type="number" name="best" />h</td>
	<td><b>Most Likely</b><br><input required size="5" type="number" name="likely" />h</td>
	<td><b>Pessimistic</b><br><input required size="5" type="number" name="worst" />h</td>
	<td valign="bottom" style="text-align: right">
		<button type="button" class="pertAddRow">➕</button>
		<button type="button" class="pertRemoveRow">➖</button>
	</td>`;

const pertDialogWrapper = document.createElement('div');
pertDialogWrapper.innerHTML = `<dialog id="pertDialog">
	<form  id="pertForm" method="dialog">
		<table>
			<tbody id="pertTableBody"></tbody>
			<tfoot>
				<td colspan="3"><label><input type="checkbox" checked name="showTotal">Include total row</label></td>
				<td colspan="2" style="text-align: right">
					<button id="pertSubmit" type="submit">Add to Comment</button>
					<button value="cancel" formnovalidate>Cancel</button>
				</td>
			</tfoot>
		</table>
	</form>
	</dialog>`;
document.body.appendChild(pertDialogWrapper);

const pertDialog = document.getElementById('pertDialog');
const pertForm = document.getElementById('pertForm');
const pertSubmit = document.getElementById('pertSubmit');
const pertTableBody = document.getElementById('pertTableBody');
const pertValues = [];

// clone row
pertRow.innerHTML = pertRowHTML;
pertTableBody.appendChild(pertRow);
// remove the remove button since we don't want to remove a single row
pertTableBody.querySelector('.pertRemoveRow').hidden = true;
// show modal
pertDialog.showModal();

/**
 * Add a new estimate row
 * 
 * @param {Event} e click event
 * @returns {void}
 */
const handlePertAddRow = e => {
	e.preventDefault();
	const addButton = e.target;
	addButton.hidden = true;
	// clone a new row
	const newPertRow = document.createElement('tr');
	newPertRow.innerHTML = pertRowHTML;
	pertTableBody.appendChild(newPertRow);
	console.log('here')
	// focus new title field
	addButton.closest('tr').nextSibling.querySelector('[name="task"]').focus();

};

/**
 * Remove estimate row
 * 
 * @param {Event} e click event
 * @returns {void}
 */
const handlePertRemoveRow = e => {
    e.preventDefault();
	const removeButton = e.target;
	const thisRow = removeButton.closest('tr');
	const previousRow = thisRow.previousElementSibling;
	if (thisRow.nextSibling === null) {
		// if previous row is the last row, show add row button
		previousRow.querySelector('.pertAddRow').hidden = false;
	}
    thisRow.remove();
};

/**
 * Attach handlers based on class
 * 
 * @param {Event} e click event
 * @returns {void}
 */
const pertDialogHandlers = e => {
    if (e.target && e.target.classList.contains('pertAddRow')){
		handlePertAddRow(e)
    }

	if (e.target && e.target.classList.contains('pertRemoveRow')){
		handlePertRemoveRow(e)
    }
}

// attach events to document so we can add items dynamically
document.addEventListener('click', pertDialogHandlers, true);

pertDialog.addEventListener('close', function onClose() {
	// remove event listeners
	document.removeEventListener('click', pertDialogHandlers, true);
	// remove dialog
	pertDialog.remove();

	// if its cancrl action, do nothing
	if (pertDialog.returnValue === "cancel") return;

	const formData = new FormData(pertForm);

	const pertData = {
		task: formData.getAll("task"),
		best: formData.getAll("best").map(a => 60 * a),
		likely: formData.getAll("likely").map(a => 60 * a),
		worst: formData.getAll("worst").map(a => 60 * a),
		showTotal: "on" === formData.get("showTotal")
	}

	const rowHTML = pertData.task.map((_, index) => {
		const best = toTimeString(pertData.best[index]);
		const likely = toTimeString(pertData.likely[index]);
        const worst = toTimeString(pertData.worst[index]);
        const pert = (pertData.best[index] + (4 * pertData.likely[index]) + pertData.worst[index]) / 6;
		pertValues.push(pert);
        return `<tr>
			${ pertData.task[0] === '' && pertData.task.length === 1 ? "" : `<td rowspan="1" colspan="1"><p>${pertData.task[index]}</p></td>` }
			<td rowspan="1" colspan="1" data-colwidth="115"><p>${best}</p></td>
			<td rowspan="1" colspan="1" data-colwidth="115"><p>${likely}</p></td>
			<td rowspan="1" colspan="1" data-colwidth="115"><p>${worst}</p></td>
			<td rowspan="1" colspan="1" data-colwidth="115"><p>${toTimeString(pert)}</p></td>
		</tr>`
	});

	const commentBox = document.querySelector("[contenteditable=\"true\"]");

	// clear the message box if it's just the placeholder
	if (commentBox.innerHTML.includes('Add a comment\u2026')) {
		commentBox.innerHTML = "";
	}

    commentBox.innerHTML+=`<table data-number-column="false">
		<tbody>
			<tr>
				${ pertData.task[0] === '' && pertData.task.length === 1 ? "" : `<th rowspan="1" colspan="1"><p><strong data-renderer-mark="true">Task</strong></p></th>` }
				<th rowspan="1" colspan="1"><p data-renderer-start-pos="4"><strong data-renderer-mark="true">Optimistic</strong></p></th>
				<th rowspan="1" colspan="1"><p data-renderer-start-pos="12"><strong data-renderer-mark="true">Most Likely</strong></p></th>
				<th rowspan="1" colspan="1"><p data-renderer-start-pos="22"><strong data-renderer-mark="true">Pessimistic</strong></p></th>
				<th rowspan="1" colspan="1"><p data-renderer-start-pos="31"><strong data-renderer-mark="true">PERT</strong></p></th>
			</tr>
			${rowHTML.join('')}
			${pertData.showTotal && pertData.task.length > 1 ? `<tr>
				<td rowspan="1" colspan="1"><p>Total</p></td>
				<td rowspan="1" colspan="1" data-colwidth="115"><p>${getTotals(pertData.best)}</p></td>
				<td rowspan="1" colspan="1" data-colwidth="115"><p>${getTotals(pertData.likely)}</p></td>
				<td rowspan="1" colspan="1" data-colwidth="115"><p>${getTotals(pertData.worst)}</p></td>
				<td rowspan="1" colspan="1" data-colwidth="115"><p>${getTotals(pertValues)}</p></td></tr>` : ''}
		</tbody>
	</table>`;
});