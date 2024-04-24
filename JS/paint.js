document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const clearBtn = document.getElementById("clear-btn");
    const colorPicker = document.getElementById("color-picker");
    const brushSizeInput = document.getElementById("brush-size");
    const downloadBtn = document.getElementById("download-btn");

    let isPainting = false;
    let currentColor = colorPicker.value;
    let brushSize = brushSizeInput.value;

    function startPainting(event) {
        isPainting = true;
        draw(event);
    }

    function stopPainting() {
        isPainting = false;
        context.beginPath(); // Reset the context for the next line
    }

    function draw(event) {
        if (!isPainting) return;

        const x = event.clientX - canvas.offsetLeft;
        const y = event.clientY - canvas.offsetTop;

        context.strokeStyle = currentColor;
        context.lineWidth = brushSize;
        context.lineCap = "round";
        context.lineTo(x, y);
        context.stroke();
        context.beginPath(); // Start a new line
        context.moveTo(x, y);
    }

    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    }

    function updateColor() {
        currentColor = colorPicker.value;
    }

    function updateBrushSize() {
        brushSize = brushSizeInput.value;
    }

    function downloadImage() {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "painting.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mousemove", draw);

    clearBtn.addEventListener("click", clearCanvas);
    colorPicker.addEventListener("input", updateColor);
    brushSizeInput.addEventListener("input", updateBrushSize);
    downloadBtn.addEventListener("click", downloadImage);
});
