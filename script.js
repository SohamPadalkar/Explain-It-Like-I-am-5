const explainBtn = document.getElementById('explainBtn');
const topicInput = document.getElementById('topicInput');
const outputArea = document.getElementById('outputArea');
const historyList = document.getElementById('historyList');

const history = [];

function renderHistory() {
  historyList.innerHTML = '';

  history.forEach((item, index) => {
    const li = document.createElement('li');
    li.style.marginBottom = '1rem';
    li.style.borderBottom = '1px solid #444';
    li.style.paddingBottom = '0.5rem';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = `🔎 ${item.topic}`;
    toggleBtn.style.background = 'transparent';
    toggleBtn.style.color = '#ffd700';
    toggleBtn.style.border = 'none';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontWeight = 'bold';

    const answerDiv = document.createElement('div');
    answerDiv.textContent = item.answer;
    answerDiv.style.marginTop = '0.5rem';
    answerDiv.style.color = '#ccc';
    answerDiv.style.display = 'none';

    toggleBtn.addEventListener('click', () => {
      answerDiv.style.display = answerDiv.style.display === 'none' ? 'block' : 'none';
    });

    li.appendChild(toggleBtn);
    li.appendChild(answerDiv);
    historyList.appendChild(li);
  });
}

const storedHistory = localStorage.getItem("explanationHistory");
if (storedHistory) {
  history.push(...JSON.parse(storedHistory));
  renderHistory();
}

/* Legacy mock explanation logic (commented out)
explainBtn.addEventListener('click', () => {
  const userTopic = topicInput.value.trim();

  if (userTopic === '') {
    outputArea.style.display = 'block';
    outputArea.textContent = "Please enter a topic first!";
    return;
  }

  outputArea.style.display = 'block';
  outputArea.textContent = "Thinking about your topic... 🤔";

  setTimeout(() => {
    const explanation = generateSimpleExplanation(userTopic);
    outputArea.textContent = explanation;

    history.push({ topic: userTopic, answer: explanation });
    renderHistory();
  }, 1000);
});
*/

document.getElementById("explainBtn").addEventListener("click", async () => {
  const topic = topicInput.value.trim();
  if (!topic) return;

  outputArea.style.display = 'block';
  outputArea.textContent = "Explaining... 🧠";

  try {
    const response = await fetch("https://explain-it-like-i-am-5.onrender.com/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });

    const data = await response.json();
    const explanation = data.explanation || generateSimpleExplanation(topic);

    outputArea.textContent = explanation;
    updateHistory(topic, explanation);
  } catch (error) {
    outputArea.textContent = "Something went wrong!";
    console.error("Error:", error);
  }
});

function generateSimpleExplanation(topic) {
  return `🧠 Here's a simple explanation about "${topic}" like you're 5:\n\nImagine it's like stacking blocks — piece by piece, you understand how "${topic}" works! 🧱`;
}



const clearHistoryBtn = document.getElementById('clearHistoryBtn');

clearHistoryBtn.addEventListener('click', () => {
  history.length = 0;
  localStorage.removeItem("explanationHistory");
  renderHistory();
});

function updateHistory(topic, explanation) {
  history.push({ topic, answer: explanation });
  localStorage.setItem("explanationHistory", JSON.stringify(history));
  renderHistory();
}
