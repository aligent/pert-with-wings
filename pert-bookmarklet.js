javascript:(function()%7Bconst%20toTimeString%3Dt%3D%3E%60%24%7BMath.floor(t%2F60)%7Dh%24%7Bt%2560%3F%60%20%24%7BString(Math.floor(t%2560)).padStart(2%2C%220%22)%7Dm%60%3A%22%22%7D%60%2CgetTotals%3Dt%3D%3Et.reduce(((t%2Ce)%3D%3Et%2Be)%2C0)%2CgetMinutes%3Dt%3D%3E%7Bif(!t)return%200%3Bconst%20e%3D%5B...t.matchAll(%2F(%5Cd%2B(%3F%3A%5C.%5Cd%2B)%3F)%2B(h%7Cm)%2Fgi)%5D%3Bif(e.length)%7Bconst%20t%3De.map((t%3D%3E%22h%22%3D%3D%3Dt.at(-1)%3FNumber(t%5B0%5D.replace(%2Fh%7Cm%2Fi%2C%22%22))%3ANumber(t%5B0%5D.replace(%2Fh%7Cm%2Fi%2C%22%22))%2F60)).reduce(((t%2Ce)%3D%3Et%2Be))%3Breturn%20Math.floor(60*t)%7Dreturn%20Math.floor(60*Number(t))%7D%2CpertRow%3Ddocument.createElement(%22tr%22)%2CpertRowHTML%3D'%5Cn%5Ct%3Ctd%3E%3Cb%3ETask%3C%2Fb%3E%3Cbr%3E%3Cinput%20size%3D%2220%22%20type%3D%22text%22%20name%3D%22task%22%20%2F%3E%3C%2Ftd%3E%5Cn%5Ct%3Ctd%3E%3Cb%3EBest%20Case%3C%2Fb%3E%3Cbr%3E%3Cinput%20required%20size%3D%225%22%20type%3D%22text%22%20name%3D%22best%22%20%2F%3E%3C%2Ftd%3E%5Cn%5Ct%3Ctd%3E%3Cb%3ELikely%3C%2Fb%3E%3Cbr%3E%3Cinput%20required%20size%3D%225%22%20type%3D%22text%22%20name%3D%22likely%22%20%2F%3E%3C%2Ftd%3E%5Cn%5Ct%3Ctd%3E%3Cb%3EWorst%20Case%3C%2Fb%3E%3Cbr%3E%3Cinput%20required%20size%3D%225%22%20type%3D%22text%22%20name%3D%22worst%22%20%2F%3E%3C%2Ftd%3E%5Cn%5Ct%3Ctd%20valign%3D%22bottom%22%20style%3D%22text-align%3A%20right%22%3E%5Cn%5Ct%5Ct%3Cbutton%20type%3D%22button%22%20class%3D%22pertAddRow%22%3E%E2%9E%95%3C%2Fbutton%3E%5Cn%5Ct%5Ct%3Cbutton%20type%3D%22button%22%20class%3D%22pertRemoveRow%22%3E%E2%9E%96%3C%2Fbutton%3E%5Cn%5Ct%3C%2Ftd%3E'%2CpertDialogWrapper%3Ddocument.createElement(%22div%22)%3BpertDialogWrapper.innerHTML%3D'%3Cdialog%20id%3D%22pertDialog%22%3E%5Cn%5Ct%3Cform%20%20id%3D%22pertForm%22%20method%3D%22dialog%22%3E%5Cn%5Ct%5Ct%3Cp%3ETime%20values%20can%20be%20either%20hour%20value%20(1.5)%20or%20hours%20and%20minutes%20(1h%2030m)%3C%2Fp%3E%5Cn%5Ct%5Ct%3Ctable%3E%5Cn%5Ct%5Ct%5Ct%3Ctbody%20id%3D%22pertTableBody%22%3E%3C%2Ftbody%3E%5Cn%5Ct%5Ct%5Ct%3Ctbody%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Ctr%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%3Ctd%20colspan%3D%224%22%3ESolution%20Design%20(Scoping)%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%3Ctd%20colspan%3D%221%22%3E%3Cinput%20required%20size%3D%225%22%20type%3D%22text%22%20name%3D%22scoping%22%20%2F%3E%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3C%2Ftr%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftbody%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3Ctbody%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%3Ctd%20colspan%3D%225%22%3E%3Csmall%3EUse%20override%20field%20to%20switch%20to%20non%20percentage%20based%20time%3C%2Fsmall%3E%3C%2Ftd%3E%3C%2Ftr%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Ctr%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%3Ctd%20colspan%3D%222%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Comms%2C%20Deploys%20and%20QA%20(20%25%20recommended)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%3Ctd%20colspan%3D%222%22%20style%3D%22text-align%3A%20right%22%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3Cinput%20required%20min%3D%220%22%20max%3D%22100%22%20value%3D%2220%22%20step%3D%225%22%20type%3D%22range%22%20name%3D%22comms_deploys_qa%22%20oninput%3D%22this.nextElementSibling.value%20%3D%20this.value%22%2F%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3Coutput%3E20%3C%2Foutput%3E%25%20or%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20size%3D%225%22%20type%3D%22text%22%20name%3D%22comms_deploys_qa_override%22%20placeholder%3D%22override%22%20%2F%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3C%2Ftr%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Ctr%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%3Ctd%20colspan%3D%222%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Code%20review%20and%20Fixes%20(10%25%20recommended)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%3Ctd%20colspan%3D%223%22%20style%3D%22text-align%3A%20right%22%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3Cinput%20required%20min%3D%220%22%20max%3D%22100%22%20value%3D%2210%22%20step%3D%225%22%20type%3D%22range%22%20name%3D%22code_review%22%20oninput%3D%22this.nextElementSibling.value%20%3D%20this.value%22%2F%3E%20%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3Coutput%3E10%3C%2Foutput%3E%25%20or%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20size%3D%225%22%20type%3D%22text%22%20name%3D%22code_review_override%22%20placeholder%3D%22override%22%20%2F%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3C%2Ftr%3E%5Cn%5Ct%5Ct%5Ct%3C%2Ftbody%3E%5Cn%5Ct%5Ct%5Ct%3Ctfoot%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Ctr%3E%5Ct%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%3Ctd%20colspan%3D%222%22%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3Clabel%3E%3Cinput%20type%3D%22checkbox%22%20name%3D%22updateOriginalEstimate%22%20%2F%3E%20Update%20original%20esitmate%20field%3C%2Flabel%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%3Ctd%20colspan%3D%223%22%20style%3D%22text-align%3A%20right%22%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3Cbutton%20id%3D%22pertSubmit%22%20type%3D%22submit%22%3EAdd%20to%20Comment%3C%2Fbutton%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3Cbutton%20value%3D%22cancel%22%20formnovalidate%3ECancel%3C%2Fbutton%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3C%2Ftr%3E%5Cn%5Ct%5Ct%5Ct%3C%2Ftfoot%3E%5Cn%5Ct%5Ct%3C%2Ftable%3E%5Cn%5Ct%3C%2Fform%3E%5Cn%5Ct%3C%2Fdialog%3E'%2Cdocument.body.appendChild(pertDialogWrapper)%3Bconst%20pertDialog%3Ddocument.getElementById(%22pertDialog%22)%2CpertForm%3Ddocument.getElementById(%22pertForm%22)%2CpertSubmit%3Ddocument.getElementById(%22pertSubmit%22)%2CpertTableBody%3Ddocument.getElementById(%22pertTableBody%22)%2CpertValues%3D%5B%5D%3BpertRow.innerHTML%3DpertRowHTML%2CpertTableBody.appendChild(pertRow)%2CpertTableBody.querySelector(%22.pertRemoveRow%22).hidden%3D!0%2CpertDialog.showModal()%3Bconst%20handlePertAddRow%3Dt%3D%3E%7Bt.preventDefault()%3Bconst%20e%3Dt.target%3Be.hidden%3D!0%3Bconst%20n%3Ddocument.createElement(%22tr%22)%3Bn.innerHTML%3DpertRowHTML%2CpertTableBody.appendChild(n)%2Cconsole.log(%22here%22)%2Ce.closest(%22tr%22).nextSibling.querySelector('%5Bname%3D%22task%22%5D').focus()%7D%2ChandlePertRemoveRow%3Dt%3D%3E%7Bt.preventDefault()%3Bconst%20e%3Dt.target.closest(%22tr%22)%2Cn%3De.previousElementSibling%3Bnull%3D%3D%3De.nextSibling%26%26(n.querySelector(%22.pertAddRow%22).hidden%3D!1)%2Ce.remove()%7D%2CpertDialogHandlers%3Dt%3D%3E%7Bt.target%26%26t.target.classList.contains(%22pertAddRow%22)%26%26handlePertAddRow(t)%2Ct.target%26%26t.target.classList.contains(%22pertRemoveRow%22)%26%26handlePertRemoveRow(t)%7D%3Bdocument.addEventListener(%22click%22%2CpertDialogHandlers%2C!0)%2CpertDialog.addEventListener(%22close%22%2C(function()%7Bif(document.removeEventListener(%22click%22%2CpertDialogHandlers%2C!0)%2CpertDialog.remove()%2C%22cancel%22%3D%3D%3DpertDialog.returnValue)return%3Bconst%20t%3Dnew%20FormData(pertForm)%2Ce%3D%7Btask%3At.getAll(%22task%22)%2Cbest%3At.getAll(%22best%22).map((t%3D%3EgetMinutes(t)))%2Clikely%3At.getAll(%22likely%22).map((t%3D%3EgetMinutes(t)))%2Cworst%3At.getAll(%22worst%22).map((t%3D%3EgetMinutes(t)))%2Cscoping%3AgetMinutes(t.get(%22scoping%22))%2Ccomms_deploys_qa%3AparseInt(t.get(%22comms_deploys_qa%22))%2Ccomms_deploys_qa_override%3At.get(%22comms_deploys_qa_override%22)%2Ccode_review%3AparseInt(t.get(%22code_review%22))%2Ccode_review_override%3At.get(%22code_review_override%22)%2Cupdate_original_estimate%3A%22on%22%3D%3D%3Dt.get(%22updateOriginalEstimate%22)%7D%2Cn%3De.task.map(((t%2Cn)%3D%3E%7Bconst%20r%3DtoTimeString(e.best%5Bn%5D)%2Co%3DtoTimeString(e.likely%5Bn%5D)%2Ca%3DtoTimeString(e.worst%5Bn%5D)%2Cd%3D(e.best%5Bn%5D%2B4*e.likely%5Bn%5D%2Be.worst%5Bn%5D)%2F6%3Breturn%20pertValues.push(d)%2C%60%3Ctr%3E%5Cn%5Ct%5Ct%5Ct%24%7B%22%22%3D%3D%3De.task%5B0%5D%26%261%3D%3D%3De.task.length%3F%22%22%3A%60%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%3E%24%7Be.task%5Bn%5D%7D%3C%2Fp%3E%3C%2Ftd%3E%60%7D%5Cn%5Ct%5Ct%5Ct%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%20data-colwidth%3D%22115%22%3E%3Cp%3E%24%7Br%7D%3C%2Fp%3E%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%20data-colwidth%3D%22115%22%3E%3Cp%3E%24%7Bo%7D%3C%2Fp%3E%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%20data-colwidth%3D%22115%22%3E%3Cp%3E%24%7Ba%7D%3C%2Fp%3E%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%20data-colwidth%3D%22115%22%3E%3Cp%3E%24%7BtoTimeString(d)%7D%3C%2Fp%3E%3C%2Ftd%3E%5Cn%5Ct%5Ct%3C%2Ftr%3E%60%7D))%2Cr%3DpertValues.reduce(((t%2Ce)%3D%3Et%2Be)%2C0)%3Bconst%20o%3De.comms_deploys_qa_override%3FgetMinutes(e.comms_deploys_qa_override)%3Ar*e.comms_deploys_qa%2F100%2Ca%3De.code_review_override%3FgetMinutes(e.code_review_override)%3Ar*e.code_review%2F100%2Cd%3Ddocument.querySelector('%5Bcontenteditable%3D%22true%22%5D')%2Cs%3DtoTimeString(r%2Be.scoping%2Bo%2Ba)%3Bif(d.innerHTML.includes(%22Add%20a%20comment%E2%80%A6%22)%26%26(d.innerHTML%3D%22%22)%2Cd.innerHTML%2B%3D%60%3Ctable%20data-number-column%3D%22false%22%3E%5Cn%5Ct%5Ct%3Ctbody%3E%5Cn%5Ct%5Ct%5Ct%3Ctr%3E%5Cn%5Ct%5Ct%5Ct%5Ct%24%7B%22%22%3D%3D%3De.task%5B0%5D%26%261%3D%3D%3De.task.length%3F%22%22%3A'%3Cth%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%3E%3Cstrong%20data-renderer-mark%3D%22true%22%3ETask%3C%2Fstrong%3E%3C%2Fp%3E%3C%2Fth%3E'%7D%5Cn%5Ct%5Ct%5Ct%5Ct%3Cth%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%20data-renderer-start-pos%3D%224%22%3E%3Cstrong%20data-renderer-mark%3D%22true%22%3EBest%20Case%3C%2Fstrong%3E%3C%2Fp%3E%3C%2Fth%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Cth%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%20data-renderer-start-pos%3D%2212%22%3E%3Cstrong%20data-renderer-mark%3D%22true%22%3ELikely%3C%2Fstrong%3E%3C%2Fp%3E%3C%2Fth%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Cth%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%20data-renderer-start-pos%3D%2222%22%3E%3Cstrong%20data-renderer-mark%3D%22true%22%3EWorst%20Case%3C%2Fstrong%3E%3C%2Fp%3E%3C%2Fth%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Cth%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%20data-renderer-start-pos%3D%2231%22%3E%3Cstrong%20data-renderer-mark%3D%22true%22%3EPERT%3C%2Fstrong%3E%3C%2Fp%3E%3C%2Fth%3E%5Cn%5Ct%5Ct%5Ct%3C%2Ftr%3E%5Cn%5Ct%5Ct%5Ct%24%7Bn.join(%22%22)%7D%5Cn%5Ct%5Ct%3C%2Ftbody%3E%5Cn%5Ct%3C%2Ftable%3E%5Cn%5Ct%3Ctable%3E%5Cn%5Ct%5Ct%3Ctbody%3E%5Cn%5Ct%5Ct%5Ct%3Ctr%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%3E%3Cstrong%20data-renderer-mark%3D%22true%22%3EPERT%20Development%20Time%3C%2Fstrong%3E%3C%2Fp%3E%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%3E%3Cstrong%20data-renderer-mark%3D%22true%22%3E%24%7BtoTimeString(r)%7D%3C%2Fstrong%3E%3C%2Fp%3E%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%3C%2Ftr%3E%5Cn%5Ct%5Ct%5Ct%3Ctr%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%3ESolution%20Design%3C%2Fp%3E%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%3E%24%7BtoTimeString(e.scoping)%7D%3C%2Fp%3E%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%3C%2Ftr%3E%5Cn%5Ct%5Ct%5Ct%3Ctr%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%3EComms%2C%20Deploys%20and%20QA%3C%2Fp%3E%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%3E%24%7BtoTimeString(o)%7D%3C%2Fp%3E%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%3C%2Ftr%3E%5Cn%5Ct%5Ct%5Ct%3Ctr%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%3ECode%20Review%20and%20Fixes%3C%2Fp%3E%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%3E%24%7BtoTimeString(a)%7D%3C%2Fp%3E%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%3C%2Ftr%3E%5Cn%5Ct%5Ct%5Ct%3Ctr%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%3E%3Cp%3E%3Cstrong%20data-renderer-mark%3D%22true%22%3ETotal%20Estimate%3C%2Fstrong%3E%3C%2Fp%3E%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3Ctd%20rowspan%3D%221%22%20colspan%3D%221%22%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%3Cp%3E%3Cstrong%20data-renderer-mark%3D%22true%22%3E%24%7Bs%7D%3C%2Fstrong%3E%3C%2Fp%3E%5Cn%5Ct%5Ct%5Ct%5Ct%3C%2Ftd%3E%5Cn%5Ct%5Ct%5Ct%3C%2Ftr%3E%5Cn%5Ct%5Ct%3C%2Ftbody%3E%5Cn%5Ct%3C%2Ftable%3E%5Cn%5Ct%60%2Ce.update_original_estimate)%7Bdocument.querySelectorAll('%5Bdata-test-id%3D%22issue-field-original-estimate.ui.view%22%5D')%5B0%5D.click()%3Bconst%20t%3Ddocument.querySelectorAll('%5Bdata-test-id%3D%22issue-field-original-estimate.ui.edit%22%5D')%5B0%5D.querySelector(%22input%22)%3BObject.getOwnPropertyDescriptor(window.HTMLInputElement.prototype%2C%22value%22).set.call(t%2Cs)%2Ct.dispatchEvent(new%20Event(%22input%22%2C%7Bbubbles%3A!0%7D))%2Cdocument.querySelectorAll('%5Bdata-test-id%3D%22issue-view.issue-base.context.original-estimate.timeoriginalestimate%22%5D')%5B0%5D.querySelector(%22button%22).click()%7D%7D))%3B%7D)()