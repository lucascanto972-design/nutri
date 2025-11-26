document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderRecipes();

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.dataset.tab);
        });
    });

    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.addEventListener('click', () => {
            switchTab('recettes');
        });
    }

    const workoutForm = document.getElementById('workout-form');
    workoutForm.addEventListener('submit', handleWorkoutForm);

    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    sendBtn.addEventListener('click', handleChatSubmit);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChatSubmit();
        }
    });
});

function switchTab(targetTab) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active-tab');
    });

    document.getElementById(targetTab).classList.remove('hidden');
    document.querySelector(`[data-tab="${targetTab}"]`).classList.add('active-tab');
}

const recipes = [
    { id: 1, name: "Poulet Grillé et Quinoa", type: "Plat principal", image: "https://images.pexels.com/photos/1251208/pexels-photo-1251208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 450, protein: 40, carbs: 35, fat: 15, ingredients: ["200g de blanc de poulet", "100g de quinoa", "Légumes variés", "Huile d'olive", "Épices"], instructions: "1. Cuire le quinoa. 2. Griller le poulet. 3. Servir avec les légumes." },
    { id: 2, name: "Salade César au Saumon", type: "Salade", image: "assets/salade-cesar-saumon.png", calories: 380, protein: 30, carbs: 10, fat: 25, ingredients: ["150g de saumon", "Laitue romaine", "Croûtons", "Parmesan", "Sauce César"], instructions: "1. Griller le saumon. 2. Mélanger la laitue avec la sauce. 3. Ajouter le saumon, les croûtons et le parmesan." },
    { id: 3, name: "Smoothie Vert Énergisant", type: "Boisson", image: "https://images.pexels.com/photos/1346345/pexels-photo-1346345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 250, protein: 10, carbs: 40, fat: 5, ingredients: ["Épinards", "Banane", "Lait d'amande", "Protéine en poudre"], instructions: "1. Mixer tous les ingrédients jusqu'à obtenir une consistance lisse." },
    { id: 4, name: "Curry de Lentilles Corail", type: "Végétarien", image: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 400, protein: 20, carbs: 60, fat: 8, ingredients: ["150g de lentilles corail", "Lait de coco", "Oignon", "Ail", "Curry en poudre"], instructions: "1. Faire revenir l'oignon et l'ail. 2. Ajouter les lentilles, le lait de coco et les épices. 3. Laisser mijoter." },
    { id: 5, name: "Omelette aux Épinards et Feta", type: "Petit-déjeuner", image: "https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 320, protein: 25, carbs: 5, fat: 22, ingredients: ["3 œufs", "Épinards frais", "Feta", "Huile d'olive"], instructions: "1. Battre les œufs. 2. Ajouter les épinards et la feta. 3. Cuire à la poêle." },
    { id: 6, name: "Barres Protéinées Maison", type: "Collation", image: "https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 180, protein: 15, carbs: 20, fat: 5, ingredients: ["Flocons d'avoine", "Protéine en poudre", "Miel", "Beurre de cacahuètes"], instructions: "1. Mélanger tous les ingrédients. 2. Presser dans un moule. 3. Réfrigérer." },
    { id: 7, name: "Soupe de Potimarron et Lait de Coco", type: "Soupe", image: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 280, protein: 8, carbs: 30, fat: 15, ingredients: ["1 potimarron", "Lait de coco", "Bouillon de légumes", "Oignon"], instructions: "1. Cuire le potimarron et l'oignon. 2. Mixer avec le bouillon et le lait de coco." },
    { id: 8, name: "Wok de Bœuf aux Légumes Croquants", type: "Plat principal", image: "https://images.pexels.com/photos/1619657/pexels-photo-1619657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 480, protein: 35, carbs: 40, fat: 20, ingredients: ["200g de bœuf", "Brocoli", "Carottes", "Poivrons", "Sauce soja"], instructions: "1. Faire sauter le bœuf. 2. Ajouter les légumes. 3. Déglacer avec la sauce soja." },
    { id: 9, name: "Pancakes à la Banane et Flocons d'Avoine", type: "Petit-déjeuner", image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 350, protein: 12, carbs: 55, fat: 10, ingredients: ["1 banane", "50g de flocons d'avoine", "2 œufs", "Levure chimique"], instructions: "1. Mixer tous les ingrédients. 2. Cuire les pancakes à la poêle." },
    { id: 10, name: "Taboulé de Chou-Fleur", type: "Salade", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 200, protein: 8, carbs: 15, fat: 12, ingredients: ["1 chou-fleur", "Tomates", "Concombre", "Menthe", "Jus de citron"], instructions: "1. Râper le chou-fleur. 2. Couper les légumes. 3. Mélanger le tout avec la menthe et le jus de citron." },
    { id: 11, name: "Filet de Cabillaud en Papillote", type: "Plat principal", image: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 300, protein: 35, carbs: 5, fat: 15, ingredients: ["200g de cabillaud", "Courgettes", "Tomates cerises", "Herbes de Provence"], instructions: "1. Placer le poisson et les légumes sur du papier sulfurisé. 2. Assaisonner. 3. Cuire au four." },
    { id: 12, name: "Mousse au Chocolat et Avocat", type: "Dessert", image: "https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 250, protein: 5, carbs: 20, fat: 18, ingredients: ["1 avocat", "Cacao en poudre", "Sirop d'érable", "Lait d'amande"], instructions: "1. Mixer tous les ingrédients jusqu'à obtenir une consistance crémeuse." },
    { id: 13, name: "Chili sin Carne", type: "Végétarien", image: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 420, protein: 18, carbs: 65, fat: 10, ingredients: ["Haricots rouges", "Maïs", "Tomates concassées", "Oignon", "Épices à chili"], instructions: "1. Faire revenir l'oignon. 2. Ajouter les autres ingrédients. 3. Laisser mijoter." },
    { id: 14, name: "Rouleaux de Printemps aux Crevettes", type: "Entrée", image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 280, protein: 20, carbs: 30, fat: 8, ingredients: ["Galettes de riz", "Crevettes", "Vermicelles de riz", "Menthe", "Laitue"], instructions: "1. Tremper les galettes de riz. 2. Garnir avec les ingrédients. 3. Rouler." },
    { id: 15, name: "Gratin de Courgettes à la Menthe", type: "Accompagnement", image: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 180, protein: 10, carbs: 12, fat: 10, ingredients: ["2 courgettes", "Fromage de chèvre", "Menthe", "Crème légère"], instructions: "1. Couper les courgettes en rondelles. 2. Alterner avec le fromage. 3. Napper de crème et cuire au four." },
    { id: 16, name: "Porridge aux Fruits Rouges", type: "Petit-déjeuner", image: "assets/porridge-remplacement.png", calories: 320, protein: 10, carbs: 60, fat: 5, ingredients: ["Flocons d'avoine", "Lait", "Fruits rouges", "Sirop d'érable"], instructions: "1. Cuire les flocons d'avoine avec le lait. 2. Servir avec les fruits rouges." },
    { id: 17, name: "Boulettes de Viande à la Suédoise (version saine)", type: "Plat principal", image: "https://images.pexels.com/photos/718742/pexels-photo-718742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 400, protein: 30, carbs: 25, fat: 20, ingredients: ["Viande hachée maigre", "Oignon", "Chapelure complète", "Lait", "Épices"], instructions: "1. Former les boulettes. 2. Cuire à la poêle. 3. Préparer une sauce légère." },
    { id: 18, name: "Energy Balls Coco-Dattes", type: "Collation", image: "https://images.pexels.com/photos/4099235/pexels-photo-4099235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", calories: 150, protein: 5, carbs: 20, fat: 6, ingredients: ["Dattes", "Noix de coco râpée", "Amandes", "Graines de chia"], instructions: "1. Mixer les ingrédients. 2. Former des boules. 3. Réfrigérer." },
    { id: 19, name: "Gaspacho Andalou", type: "Soupe", image: "assets/nouveau-plat.png", calories: 120, protein: 4, carbs: 15, fat: 5, ingredients: ["Tomates", "Concombre", "Poivron", "Oignon", "Huile d'olive"], instructions: "1. Mixer tous les légumes. 2. Ajouter l'huile d'olive. 3. Servir frais." }
];

function renderRecipes() {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = recipes.map(recipe => `
        <div class="recipe-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" data-id="${recipe.id}">
            <img src="${recipe.image}" alt="${recipe.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <span class="text-sm text-gray-500">${recipe.type}</span>
                <h3 class="text-xl font-semibold mb-2">${recipe.name}</h3>
                <div class="flex justify-between text-sm">
                    <span>🔥 ${recipe.calories} kcal</span>
                    <span>💪 ${recipe.protein}g P</span>
                    <span>🍞 ${recipe.carbs}g G</span>
                    <span>🥑 ${recipe.fat}g L</span>
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', () => {
            showRecipeDetails(card.dataset.id);
        });
    });
}

function showRecipeDetails(id) {
    const recipe = recipes.find(r => r.id == id);
    if (!recipe) return;

    const modal = document.getElementById('recipe-modal');
    const modalContent = document.getElementById('recipe-modal-content');

    modalContent.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" class="w-full h-64 object-cover rounded-t-lg">
        <div class="p-6">
            <h2 class="text-3xl font-bold mb-4">${recipe.name}</h2>
            <div class="flex justify-between text-lg mb-4">
                <span>🔥 ${recipe.calories} kcal</span>
                <span>💪 ${recipe.protein}g P</span>
                <span>🍞 ${recipe.carbs}g G</span>
                <span>🥑 ${recipe.fat}g L</span>
            </div>
            <div class="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-xl font-semibold mb-2">Ingrédients</h3>
                    <ul class="list-disc list-inside">
                        ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h3 class="text-xl font-semibold mb-2">Préparation</h3>
                    <p>${recipe.instructions}</p>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

document.getElementById('close-modal-btn').addEventListener('click', () => {
    document.getElementById('recipe-modal').classList.add('hidden');
});

// Close modal on outside click
document.getElementById('recipe-modal').addEventListener('click', (e) => {
    if (e.target.id === 'recipe-modal') {
        document.getElementById('recipe-modal').classList.add('hidden');
    }
});

function handleWorkoutForm(event) {
    event.preventDefault();
    const workoutType = document.getElementById('workout-type').value;
    const duration = document.getElementById('duration').value;
    const intensity = document.getElementById('intensity').value;
    const equipment = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(e => e.value);

    const outputDiv = document.getElementById('workout-output');
    outputDiv.innerHTML = `
        <h3 class="text-2xl font-bold mb-4">Votre Programme Personnalisé</h3>
        <p><strong>Type:</strong> ${workoutType}</p>
        <p><strong>Durée:</strong> ${duration} minutes</p>
        <p><strong>Intensité:</strong> ${intensity}/5</p>
        <p><strong>Équipement:</strong> ${equipment.join(', ') || 'Aucun'}</p>
        <div class="mt-4 border-t pt-4">
            <h4 class="font-semibold">Exemple de séance :</h4>
            <ul class="list-disc list-inside">
                <li>Échauffement : 5 minutes de corde à sauter</li>
                <li>Circuit (3 tours) : 
                    <ul class="list-disc list-inside ml-4">
                        <li>15 Pompes</li>
                        <li>20 Squats</li>
                        <li>30s de Planche</li>
                    </ul>
                </li>
                <li>Retour au calme : 5 minutes d'étirements</li>
            </ul>
        </div>
    `;
    outputDiv.classList.remove('hidden');
}

function appendMessage(sender, message) {
    const chatHistory = document.getElementById('chat-history');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('flex', 'mb-4');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('p-3', 'rounded-lg', 'max-w-xs');
    contentDiv.textContent = message;

    if (sender === 'user') {
        messageDiv.classList.add('justify-end');
        contentDiv.classList.add('bg-orange-nutri', 'text-white');
    } else {
        contentDiv.classList.add('bg-green-nutri', 'text-white');
    }

    messageDiv.appendChild(contentDiv);
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function handleChatSubmit() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage('user', message);
    userInput.value = '';

    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.classList.remove('hidden');

    await new Promise(resolve => setTimeout(resolve, 2000));

    let botResponse = "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ?";
    if (message.toLowerCase().includes('plan repas')) {
        botResponse = "Bien sûr ! Pour quel objectif souhaitez-vous un plan repas ? (ex: perte de poids, prise de masse)";
    } else if (message.toLowerCase().includes('exercice')) {
        botResponse = "Excellent choix ! Quel groupe musculaire voulez-vous travailler aujourd'hui ?";
    } else if (message.toLowerCase().includes('perdre poids')) {
        botResponse = "La perte de poids repose sur un déficit calorique. Je vous conseille de combiner une alimentation équilibrée avec une activité physique régulière. Voulez-vous des exemples de recettes faibles en calories ?";
    }

    appendMessage('bot', botResponse);
    loadingIndicator.classList.add('hidden');
}