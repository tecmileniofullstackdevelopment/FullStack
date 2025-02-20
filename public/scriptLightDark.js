document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("imgLightDark").addEventListener("click", function () {
        const colorScheme = document.body.style.colorScheme;
        if (colorScheme === "dark") {
            document.body.style.colorScheme = "light";
        } else {
            document.body.style.colorScheme = "dark";
        }
    })
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.body.style.colorScheme = (isDark) ? "dark" : "light";
});
