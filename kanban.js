
const modal = document.getElementById("taskModal");
const taskInput = document.getElementById("taskInput");

document.getElementById("addTaskBtn").addEventListener("click", () => {
    modal.style.display = "block";
    taskInput.value = "";
    taskInput.focus();
});


document.getElementById("modalAdd").addEventListener("click", () => {
    let text = taskInput.value.trim();
    if (text === "") return;

    const task = createTask(text);
    document.querySelector('[data-status="todo"] .taskList').appendChild(task);

    modal.style.display = "none";
});

document.getElementById("modalCancel").addEventListener("click", () => {
    modal.style.display = "none";
});



function createTask(text) {
    const task = document.createElement("div");
    task.classList.add("task");
    task.textContent = text;

    task.draggable = true;

    task.addEventListener("dragstart", () => {
        task.classList.add("dragging");
    });

    task.addEventListener("dragend", () => {
        task.classList.remove("dragging");
    });

    return task;
}


document.querySelectorAll(".taskList").forEach(list => {
    list.addEventListener("dragover", e => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        list.appendChild(dragging);
    });
});


const clearModal = document.getElementById("clearModal");

document.getElementById("clearBoardBtn").addEventListener("click", () => {
    clearModal.style.display = "block";
});


document.getElementById("clearYes").addEventListener("click", () => {
    document.querySelectorAll(".taskList").forEach(list => list.innerHTML = "");
    clearModal.style.display = "none";
});


document.getElementById("clearNo").addEventListener("click", () => {
    clearModal.style.display = "none";
});


window.addEventListener("click", e => {
    if (e.target === clearModal) {
        clearModal.style.display = "none";
    }
});


document.getElementById("saveBoardBtn").addEventListener("click", () => {
    html2canvas(document.body).then(canvas => {
        const link = document.createElement("a");
        link.download = "kanban_board.png";
        link.href = canvas.toDataURL();
        link.click();
    });
});


const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
document.body.appendChild(script);

window.addEventListener("click", e => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

document.getElementById("savePdfBtn").addEventListener("click", () => {
    html2canvas(document.body).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");

        let width = pdf.internal.pageSize.getWidth();
        let height = canvas.height * width / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save("kanban_board.pdf");
    });
});

const emailModal = document.getElementById("emailModal");
const emailInput = document.getElementById("emailInput");

document.getElementById("sendMailBtn").addEventListener("click", () => {
    emailInput.value = "";
    emailModal.style.display = "block";
});

document.getElementById("emailCancelBtn").addEventListener("click", () => {
    emailModal.style.display = "none";
});

document.getElementById("emailSendBtn").addEventListener("click", () => {
    let email = emailInput.value.trim();
    if (email === "") return;

    let tasks = [];
    document.querySelectorAll(".task").forEach(t => tasks.push(t.textContent));

    let body = "Sadržaj Vaše Kanban ploče:%0D%0A%0D%0A" + tasks.join("%0D%0A");

    window.location.href = `mailto:${email}?subject=Kanban ploča&body=${body}`;

    emailModal.style.display = "none";
});

window.addEventListener("click", e => {
    if (e.target === emailModal) {
        emailModal.style.display = "none";
    }
});

