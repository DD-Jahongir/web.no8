document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const openFormBtn = document.getElementById("openFormBtn");
    const closeFormBtn = document.getElementById("closeFormBtn");
    const feedbackForm = document.getElementById("feedbackForm");
    const responseMessage = document.getElementById("responseMessage");

    // LocalStorage data restoration
    const restoreFormData = () => {
        const savedData = JSON.parse(localStorage.getItem("formData")) || {};
        Object.keys(savedData).forEach(key => {
            const input = document.getElementById(key);
            if (input) input.value = savedData[key];
        });
    };

    const saveFormData = () => {
        const formData = {};
        new FormData(feedbackForm).forEach((value, key) => {
            formData[key] = value;
        });
        localStorage.setItem("formData", JSON.stringify(formData));
    };

    const clearFormData = () => {
        localStorage.removeItem("formData");
        feedbackForm.reset();
    };

    const showPopup = () => {
        popup.style.display = "flex";
        history.pushState({ popup: true }, "", "#feedback-form");
    };

    const closePopup = () => {
        popup.style.display = "none";
        history.back();
    };

    const closePopup2 = () => {
        popup.style.display = "none";
        history.back();
    };

    // Open/Close popup
    openFormBtn.addEventListener("click", showPopup);
    closeFormBtn.addEventListener("click", closePopup2);

    // History handling
    window.addEventListener("popstate", (event) => {
        if (!event.state?.popupOpen) {
            closePopup();
        } else {
            showPopup();
        }
    });

    // Submit form
    feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        saveFormData();
        try {
            const formData = new FormData(feedbackForm);
            const response = await fetch("https://formcarry.com/s/your-form-endpoint", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                closePopup();
                clearFormData();
                alert("Форма успешно отправлена!");
            } else {
                throw new Error("Ошибка при отправке формы");
            }
        } catch (error) {
            responseMessage.textContent = error.message;
            responseMessage.style.color = "red";
        }
    });

    // Restore form data
    restoreFormData();
});
