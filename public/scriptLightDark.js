document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("imgLightDark");
    const progBarGif = document.getElementById("walk");

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        document.body.style.colorScheme = savedTheme; 
    } else {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.body.style.colorScheme = isDark ? "dark" : "light";
    }

    if (document.body.style.colorScheme === "dark") {
        toggleButton.classList.add("inverted");
        if(progBarGif !== null){
            progBarGif.classList.add("inverted");
        } 
    } else {
        toggleButton.classList.remove("inverted");
        if(progBarGif !== null){
            progBarGif.classList.remove("inverted");
        }
    }

    document.getElementById("imgLightDark").addEventListener("click", function () {
        const colorScheme = document.body.style.colorScheme;
        const newTheme = document.body.style.colorScheme = (colorScheme === "dark") ? "light" : "dark";
        document.body.style.colorScheme = newTheme;
        localStorage.setItem("theme", newTheme);
        this.classList.toggle("inverted");//Llama al estilo de colores invertido para el boton
        progBarGif.classList.toggle("inverted"); //Llama al estilo de colores invertido para el gif
    });
});

