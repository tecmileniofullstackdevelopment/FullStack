document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("imgLightDark").addEventListener("click", function () {
        const colorScheme = document.body.style.colorScheme;
        const progBarGif = document.getElementById("walk");
        this.classList.toggle("inverted");//Llama al estilo de colores invertido para el boton
        document.body.style.colorScheme = (colorScheme === "dark") ? "light" : "dark";
        progBarGif.classList.toggle("inverted"); //Llama al estilo de colores invertido para el gif
    })
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.body.style.colorScheme = (isDark) ? "dark" : "light";
});

