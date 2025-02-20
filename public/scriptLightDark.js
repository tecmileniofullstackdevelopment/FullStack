document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("imgLightDark").addEventListener("click", function () {
        const colorScheme = document.body.style.colorScheme;
        document.body.style.colorScheme = (colorScheme === "dark") ? "light" : "dark";
    })
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.body.style.colorScheme = (isDark) ? "dark" : "light";
});
