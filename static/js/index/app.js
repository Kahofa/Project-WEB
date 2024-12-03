const input = document.getElementById('inputIdea');
const createBtn = document.getElementById('create');
const errorCheck = document.getElementById('errorCheck');
const serviceGrid = document.querySelector('.service-grid');
const tempId = 10000;

create.addEventListener('click', async () => {
            const ideaText = input.value;

            if (!ideaText.trim()) {
                return;
            }
            if(ideaText.length < 20){
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
            }
        });


function addCard() {
  const inputValue = input.value.trim();
  let error = "";

  if (inputValue.length < 20) {
    error = "Пожалуйста, опишите вашу идею более подробнее";
  } else if (inputValue.length > 1000) {
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

function addCardToGrid(title){
    const username = sessionStorage.getItem('username');
          if(username == null){
                fetch('/get-username')
                 .then(response => response.json())
                .then(data => {
                 sessionStorage.setItem('username', data.username)
                     })
                 .catch(error => console.error('Error:', error));
          }
  const newCard = document.createElement('div');
  newCard.classList.add('service-card', 'w-inline-block');
  newCard.innerHTML = `
    <div class="service-content">
      <h1>${title}</h1>
      <div class="service-tab-holder">
        <div class="servce-tag">
          <div class="service-text-tag">Удалить</div>
        </div>
        <div class="servce-tag">
              <div class="service-text-tag">${username}</div>
            </div>
      </div>
    </div>
  `;

  serviceGrid.appendChild(newCard);
  location.reload();
}

serviceGrid.onclick = function (event) {
          const username = sessionStorage.getItem('username');
          if(username == null){
                fetch('/get-username')
                 .then(response => response.json())
                .then(data => {
                 sessionStorage.setItem('username', data.username)
                     })
                 .catch(error => console.error('Error:', error));
          }
          const clickedElement = event.target;

          if (clickedElement.classList.contains('service-text-tag')) {
            const cardToRemove = clickedElement.closest('.service-card');
            if (cardToRemove) {
                const cardId = cardToRemove.id;
                if (cardId){
                const owner = clickedElement.parentElement.nextElementSibling;
                if (owner){
                const ownerName = owner.querySelector('.service-text-tag').textContent.trim();
                    if (username === ownerName){
                     errorCheck.innerHTML = "";
                        fetch('/delete_idea/' + cardId, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    })
                    .then(response => response.json())
                    .then(data => {
                      if (data.message) {
                        cardToRemove.remove();
                      }
                    })
                    .catch(error => {
                    });
                }
                else{
                errorCheck.innerHTML = "Вы не можете удалить идею " + ownerName;
                  }
                } else {errorCheck.innerHTML = "";
                        fetch('/delete_idea/' + cardId, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    })
                    .then(response => response.json())
                    .then(data => {
                      if (data.message) {
                        cardToRemove.remove();
                      }
                    })
                    .catch(error => {
                    });}
              } else {
              cardToRemove.remove();
              errorCheck.innerHTML = "";
              }
              }
          }
          };
