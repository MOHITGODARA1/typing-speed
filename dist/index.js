const text = document.querySelector(".text");
let scroll = document.querySelector(".scrollbar-hide");

const textitem=["Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quod at reiciendis inventore quaerat deserunt deleniti sit. Autem inventore sint natus provident praesentium sapiente incidunt, impedit qui ab deleniti officiis alias facere, obcaecati placeat optio consectetur deserunt? Doloremque at deleniti illo earum, officiis perspiciatis blanditiis possimus, aliquid commodi minus labore sed?","Typing is a skill that improves with daily effort. You must build muscle memory through repetition. Focus not only on speed but also on being accurate. Look at the screen, not your fingers. Let your hands flow naturally across the keys. If you make a mistake, don’t stop. Keep typing and fix errors after. Practicing regularly will lead to steady progress and greater confidence. Stay patient, and trust the process.","Consistency is the secret to mastering typing. Try to set aside ten to fifteen minutes each day to practice. Start slow and then gradually increase your speed. Avoid glancing at the keyboard. Instead, train your fingers to reach the correct keys on their own. Make sure your posture is right, and your wrists are relaxed. Good habits prevent strain and help you type for longer periods without discomfort or fatigue.","The art of typing is all about rhythm and flow. When your fingers move in sync with your thoughts, typing becomes effortless. You don’t need to rush; just aim for smooth, steady strokes. Over time, you’ll begin to type without thinking about the position of each key. This is the power of practice. Many great typists began slowly, made mistakes, but stayed persistent and eventually reached impressive speeds.","In the beginning, you may find it difficult to type without looking down. This is normal. Don’t be discouraged if you make frequent mistakes. The important thing is to keep going. Each mistake is a lesson, not a failure. Use online tools to test your speed and track your improvement. Watching your progress will motivate you to practice more. Keep typing and stay determined—it gets easier every day."];

let i = 0;
let started = false;
let at = 0;
let count = -1;
let span = [];
let correcttypedchar = 0;
let inter; // timer interval
let timeinsec;
let pre;
let errors=0;
let totalpreciction=0;
let kewhandler;

const second = document.querySelector(".second");
const minut = document.querySelector(".min");

function lod(i) {
  text.innerHTML = textitem[i].split("").map(char => `<span>${char}</span>`).join("");
  span = document.querySelectorAll(".text span");
  if (span[0]) span[0].classList.add("textcontent");
}

lod(i);

function start() {
  if (started) return;
  started = true;
  timer();
  if(selectcon==0){
    alert("selecttime");
    return;
  }
  
    kewhandler= function (event) {
    if (event.key === "Tab" || event.key === "Shift") return;
    console.log(event.key);
    if (event.key === "Backspace") {
      if (count >= 0) {
        if( span[count].style.color==='red'){
          console.log("red tha");
          errors--;
        }else{
          console.log("blue the");
          correcttypedchar--;
        }
        span[count].style.color = "black";
        span[count].classList.remove("textcontent"); 
        count--;
        if (count >= 0) span[count].classList.add("textcontent"); 
        scroll.scrollLeft -= 120;
        at -= 120;
        // errors--;
        // correcttypedchar--;
      }
      return;
    }

    if (count + 1 >= span.length) return;

    if (count >= 0) span[count].classList.remove("textcontent"); 

    count++;
    span[count].classList.add("textcontent");

    const char = span[count].textContent;
    const previouseventkey=event.key;
    if (char === event.key) {
      span[count].style.color = "green";
      correcttypedchar++;
    } else {
      errors++;
      span[count].style.color = "red";
    }

    if ((count + 1) % 10 === 0) {
      scroll.scrollLeft += 120;
      at += 120;
    }
  };
  window.addEventListener("keydown", kewhandler);
}


//aftertime commplete



//resetbutton
function reset() {
  
  started = false;
  count = -1;
  correcttypedchar = 0;
  if( kewhandler){
    window.removeEventListener("keydown", kewhandler);
    kewhandler=null;
  }

  span.forEach(s => {
    s.style.color = "black";
    s.classList.remove("textcontent");
  });
  if(selectcon!=0){
    if (inter) clearInterval(inter);
  }
  document.getElementById("wpm").textContent = "0";
  document.getElementById("error").textContent="0";
  document.getElementById("acu").textContent=`0%`;
  if (span[0]) span[0].classList.add("textcontent");

  timeinsec = pre;
  timecal(timeinsec);
  second.style.color = "white";
  minut.style.color = "white";

  scroll.scrollLeft -= at;
  at = 0;
}


//next button
function next() {
  i = (i + 1) % textitem.length;
  reset();
  lod(i);
}


function aftercompletion() {
  // document.getElementById("result").style.display = "block";
  const wpm = Math.round(correcttypedchar / 5);
  document.getElementById("wpm").textContent = wpm;
  document.getElementById("error").textContent=errors;
  let acur=correcttypedchar/(correcttypedchar+errors);
  if(acur==0){
    document.getElementById("acu").textContent="0%";
  }
  document.getElementById("acu").textContent=`${(acur*100).toFixed(2)}%`;
}


//if select

let selectcon=0;
//time section
const selecttime = document.querySelectorAll(".selecttime");

selecttime.forEach(div => {
  div.addEventListener("click", () => {
    selectcon++;
    const selectedtime = div.children[0].textContent.replace(/\D/g, "");
    reset();
    if (selectedtime === "30") {
      timecal(Number(selectedtime));
    } else {
      timecal(Number(selectedtime) * 60);
    }
  });
});

function timecal(time) {
  timeinsec = time;
  pre = time;
  document.getElementById("timer").style.display = "flex";

  switch (time) {
    case 30:
      minut.textContent = "00";
      second.textContent = "30";
      break;
    case 60:
      minut.textContent = "01";
      second.textContent = "00";
      break;
    case 120:
      minut.textContent = "02";
      second.textContent = "00";
      break;
  }
}

function timer() {
  if (inter) clearInterval(inter);

  inter = setInterval(() => {
    timeinsec--;
    const minu = Math.floor(timeinsec / 60);
    const sec = timeinsec % 60;

    minut.textContent = String(minu).padStart(2, "0");
    second.textContent = String(sec).padStart(2, "0");

    if (timeinsec <= 0) {
      minut.textContent = "00";
      second.textContent = "00";
      clearInterval(inter);
      if( kewhandler){
        window.removeEventListener("keydown", kewhandler);
        kewhandler=null;
      }
      aftercompletion();
      started = false;
    }
  }, 1000);
}




