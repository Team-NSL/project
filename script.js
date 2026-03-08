const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(50px)";
    section.style.transition = "1s ease";
    observer.observe(section);
});

document.getElementById("scrollTopBtn").addEventListener("click", () => {
    document.getElementById("hero")
        .scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href"))
            .scrollIntoView({ behavior: "smooth" });
    });
});

// блоббы
const blobs = document.querySelectorAll(".blob");

function getPageWidth() {
    return document.documentElement.scrollWidth;
}

function getPageHeight() {
    return document.body.scrollHeight;
}

blobs.forEach((blob, index) => {

    let posX = Math.random() * getPageWidth();
    let posY = Math.random() * getPageHeight();

    let velocityX = (Math.random() - 0.5) * 2;
    let velocityY = (Math.random() - 0.5) * 2;

    function animate() {

        posX += velocityX;
        posY += velocityY;

        // Границы всей страницы
        if (posX < -300 || posX > getPageWidth() + 300) velocityX *= -1;
        if (posY < -300 || posY > getPageHeight() + 300) velocityY *= -1;

        blob.style.transform = `translate(${posX}px, ${posY}px)`;

        requestAnimationFrame(animate);
    }

    animate();
});



const form = document.getElementById("contactForm");
const statusBlock = document.querySelector(".form-status");

form.addEventListener("submit", async function(e){

e.preventDefault();

const formData = new FormData(form);

const data = {
name: formData.get("name"),
email: formData.get("email"),
message: formData.get("message")
};

statusBlock.textContent = "Отправка...";

try{

const response = await fetch("/api/contact",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
});

if(response.ok){

statusBlock.textContent="Сообщение отправлено!";
form.reset();

}else{

statusBlock.textContent="Ошибка отправки";

}

}catch{

statusBlock.textContent="Сервер недоступен";

}

});
