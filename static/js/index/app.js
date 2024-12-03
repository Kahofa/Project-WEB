const input = document.getElementById('inputIdea');
const createBtn = document.getElementById('create');
const errorCheck = document.getElementById('errorCheck');
const serviceGrid = document.querySelector('.service-grid');

create.addEventListener('click', async () => {
            const ideaText = input.value;

            if (!ideaText.trim()) {
                alert('Please enter your idea!');
                return;
            }

            try {
                const response = await fetch('/add_idea', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idea_text: ideaText }),
                });

                const result = await response.json();
            } catch (error) {
                console.error('Error submitting idea:', error);
                alert('An error occurred while submitting your idea.');
            }
        });

function addCard() {
  const inputValue = input.value.trim();
  let error = "";

  if (inputValue.length < 20) {
    error = "Пожалуйста, опишите вашу идею более подробнее";
  } else if (inputValue.length > 150) {
    error = "Пожалуйста, опишите вашу идею менее подробнее";
  }

  if (error) {
    errorCheck.innerHTML = error;
  } else {
    errorCheck.innerHTML = "";
    addCardToGrid(inputValue);
    input.value = "";
  }
}

createBtn.onclick = function (event) {
  event.preventDefault();
  addCard();
};

input.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
    addCard(); 
  }
});

function addCardToGrid(title){
  const newCard = document.createElement('div');
  newCard.classList.add('service-card', 'w-inline-block');
  newCard.innerHTML = `
    <div class="service-content">
      <h1>${title}</h1>
      <div class="service-tab-holder">
        <div class="servce-tag">
          <div class="service-text-tag">Удалить</div>
        </div>
      </div>
    </div>
  `;

  serviceGrid.appendChild(newCard);
}

serviceGrid.onclick = function (event) {
  const clickedElement = event.target;

  if (clickedElement.classList.contains('service-text-tag')) {
    const cardToRemove = clickedElement.closest('.service-card');
    if (cardToRemove) {
      cardToRemove.remove();
      // callback to delete with id
    }
  }
};
