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
        history.pushState({ popupOpen: true }, "", "#feedback-form");
    };

    const closePopup = () => {
        popup.style.display = "none";
        history.replaceState({ popupOpen: false }, "", "");
    };

    // Open/Close popup
    openFormBtn.addEventListener("click", showPopup);
    closeFormBtn.addEventListener("click", closePopup);

    // History handling
    window.addEventListener("popstate", (event) => {
        if (event.state?.popupOpen) {
            showPopup();
        } else {
            closePopup();
        }
    });

    // Submit form
    feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        saveFormData();
        try {
            const formData = new FormData(feedbackForm);
            const response = await fetch("https://formcarry.com/s/ER8Y_VGHGBL", {
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
