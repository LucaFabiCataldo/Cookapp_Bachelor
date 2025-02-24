import React from "react";

//Start des Rezeptes
import { checkRecepieStatus } from "./cookingRecepie";

//Enable Speech of Browser
import { EnableSpeechButton } from "../Text_to_Speech/UseTexToSpeech";
import { EnableSpeechButtonRecepieOfTheDay } from "../Text_to_Speech/UseTexToSpeech";
import { handleSpeechSythese } from "../Text_to_Speech/UseTexToSpeech";

import rezeptDesTagesBild from './Banane_m_Schokosoße.jpg';  // Bild importieren

//CSS
import './recipe.css'

const beispielrezept = [
  ["goToNext", "Aber kein Stress, wir fangen ganz entspannt an."],
  ["stiring", "Rühre vorsichtig das Wasser im Topf rum."],
  ["goToNext", "Pass gleich beim Schneiden auf, rutsche nicht ab!"],
  ["cut", "Wir schneide nun die halbe Banane in kleine scheiben und gebe sie auf den Teller."],
  ["goToNext", "Puh das war anstrengend, ab jetzt wirds einfacher."],
  ["stiring", "Rühre nochmal das Wasser um."],
  ["goToNext", "Pass bei der Schoko Sauce auf, sie ist sehr flüssig!"],
  ["pouring", "Gebe etwas von der Sauce über die Bananen."],
  ["goToNext", "Nur noch ein bisschen, es sieht schon toll aus!"],
  ["stiring", "Lass uns nun das Wasser zur Sicherheit ein letztes mal umrühren."],
]

const recipesGF = [
    {
      id: 1,
      name: 'Seitan-Steak mit Pfefferkruste',
      url: 'https://proveg.com/de/wp-content/uploads/sites/5/2022/09/edited-3.jpg',
      duration: '45 Minuten',
      diaetetik: 'glutenfrei',
      instructions: beispielrezept,
    },
    {
      id: 2,
      name: 'Gegrillte Avocados mit mexikanischer Hirsepfanne',
      url: "https://proveg.com/de/wp-content/uploads/sites/5/2022/03/edited-1-1.jpg",
      duration: '30 Minuten',
      diaetetik: 'Fisch',
      instructions: beispielrezept,
    },
    {
      id: 3,
      name: 'Vegane Bratensoße',
      url: 'https://proveg.com/de/wp-content/uploads/sites/5/2021/11/Vegane-Bratensosse-small.jpg',
      duration: '15 Minuten',
      diaetetik: 'glutenfrei',
      instructions: beispielrezept,
    },
    {
      id: 4,
      name: 'Veganes Filet Wellington',
      url: 'https://proveg.com/de/wp-content/uploads/sites/5/2021/11/Veganer-Wellington-Braten-small.jpg',
      duration: '15 Minuten',
      diaetetik: 'glutenfrei',
      instructions: beispielrezept,
    },
    {
      id: 5,
      name: 'Briam – kretischer Gemüseauflauf',
      url: 'https://proveg.com/de/wp-content/uploads/sites/5/2021/09/edited-1.3.jpg',
      duration: '15 Minuten',
      diaetetik: 'glutenfrei',
      instructions: beispielrezept,
    }
  ];

  const recipesVegan = [
      {
        id: 1,
        name: 'Seitan-Steak mit Pfefferkruste',
        url: 'https://proveg.com/de/wp-content/uploads/sites/5/2022/09/edited-3.jpg',
        duration: '45 Minuten',
        diaetetik: 'vegan',
        instructions: beispielrezept,
      },
      {
        id: 2,
        name: 'Gegrillte Avocados mit mexikanischer Hirsepfanne',
        url: "https://proveg.com/de/wp-content/uploads/sites/5/2022/03/edited-1-1.jpg",
        duration: '30 Minuten',
        diaetetik: 'glutenfrei',
        instructions: beispielrezept,
      },
      {
        id: 3,
        name: 'Vegane Bratensoße',
        url: 'https://proveg.com/de/wp-content/uploads/sites/5/2021/11/Vegane-Bratensosse-small.jpg',
        duration: '15 Minuten',
        diaetetik: 'vegan',
        instructions: beispielrezept,
      },
      {
        id: 4,
        name: 'Veganes Filet Wellington',
        url: 'https://proveg.com/de/wp-content/uploads/sites/5/2021/11/Veganer-Wellington-Braten-small.jpg',
        duration: '15 Minuten',
        diaetetik: 'vegan',
        instructions: beispielrezept,
      },
      {
        id: 5,
        name: 'Briam – kretischer Gemüseauflauf',
        url: 'https://proveg.com/de/wp-content/uploads/sites/5/2021/09/edited-1.3.jpg',
        duration: '15 Minuten',
        diaetetik: 'vegan',
        instructions: beispielrezept,
      }
    ];
  const recipesMeat = [
      {
        id: 1,
        name: 'Spaghetti Bolognese',
        url: 'https://www.gutekueche.at/storage/media/recipe/140784/resp/spaghetti-bolognese___webp_940_630.webp',
        duration: '45 Minuten',
        diaetetik: 'Fleisch',
        instructions: beispielrezept,
      },
      {
        id: 2,
        name: 'Pizza Margherita',
        url: "https://www.gutekueche.at/storage/media/recipe/34982/resp/pizza-margherita___webp_620_413.webp",
        duration: '30 Minuten',
        diaetetik: 'Fleisch',
        instructions: beispielrezept,
      },
      {
        id: 3,
        name: 'Caesar Salad',
        url: 'https://www.gutekueche.at/storage/media/recipe/119815/resp/caesar-salat___webp_940_630.webp',
        duration: '15 Minuten',
        diaetetik: 'Fleisch',
        instructions: beispielrezept,
      },
      {
        id: 4,
        name: 'Sonntagsbraten',
        url: 'https://images.lecker.de/boeuf-a-la-mode-rinderschmorbraten-mit-grunen-bohnen-und-kartoffelpuree,id=1d3b5188,b=lecker,w=1200,rm=sk.webp',
        duration: '15 Minuten',
        diaetetik: 'Fleisch',
        instructions: beispielrezept,
      },
      {
        id: 5,
        name: 'T-Bone Steak',
        url: 'https://images.getrecipekit.com/20240213181049-untitled-20design-20-8.png?width=650&quality=90&',
        duration: '15 Minuten',
        diaetetik: 'Fleisch',
        instructions: beispielrezept,
      }
    ];

function Recepies_Page() {

    const renderRecipes = (passedRecipies) => {
        return passedRecipies.map((recipe) => (
            <div key={recipe.id} onClick={() => {
                checkRecepieStatus(recipe.instructions); 
                handleSpeechSythese(`Lass uns zusammen ${recipe.name} kochen.`);
              }} className="recipe">
                <div>
                  <div className="recipe_img" style={{ backgroundImage: `url(${recipe.url})` }}>
                      <p className="recipe_duration">{recipe.duration}</p>
                      <p className={`recipe_diaetetik 
                          ${recipe.diaetetik === 'vegan' ? 'recipe_diaetetik_vegan' : ''} 
                          ${recipe.diaetetik === 'Fleisch' ? 'recipe_diaetetik_meat' : ''}
                          ${recipe.diaetetik === 'Fisch' ? 'recipe_diaetetik_fish' : ''}`}>
                          {recipe.diaetetik}
                      </p>
                  </div>
                  <h3 className="recipe_name">{recipe.name}</h3>
                </div>
                <EnableSpeechButton></EnableSpeechButton>
            </div>
    ));
  };

  return (
  <>
    <div id="recipe_page">
      <div id="areaReducer">
        <div id="recipieCaroussel">
          <div id="recepieOfTheDay" src={rezeptDesTagesBild}>
          </div>
          <div id="carousselText" onClick={() => {
                checkRecepieStatus(beispielrezept); 
                handleSpeechSythese(`Lass uns zusammen ein paar Schokobananen machen.`);
              }}>
            <p id="carousselRDT">Dein Rezept des Tages</p>
            <p id="carousselName">Banane mit Schokosoße</p>
            <p id="carousselDesc">Genieße köstliche, saftige Bananenpancakes – verfeinert mit einer herrlichen Schokoladensauce! Der perfekte Genuss für dein Frühstück oder einen süßen Snack zwischendurch.</p>
            <EnableSpeechButtonRecepieOfTheDay></EnableSpeechButtonRecepieOfTheDay>
          </div>
        </div>
        <div id="pageHeadline">
          <h1 className="recipe_page_secondary_headline">Mein Kochbuch</h1>
          <h2 id="recipe_page_main_headline">Was koche ich heute ?</h2>
          <h3 className="recipe_page_secondary_headline">Wie wärs mit was...</h3>
        </div>
        <div id="rezeptBloecke">
          <div>
            <p className="recipe_page_block_headline">...Saisonalem</p>
            <div className="recipe_block">
                {renderRecipes(recipesMeat)}
            </div>
          </div>
          <div>
            <p className="recipe_page_block_headline">...Veganem</p>
            <div className="recipe_block">
                {renderRecipes(recipesVegan)}
            </div>
          </div>
          <div>
            <p className="recipe_page_block_headline">...Glutenfreiem</p>
            <div className="recipe_block">
                {renderRecipes(recipesGF)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default Recepies_Page;