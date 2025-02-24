import usedModel from "/Users/lucacataldo/Documents/Bachelor/Complete_App/Web_Kopie_zum_Abgeben/frontend_react/src/components/Character/Model_with_Visemes_and_Idle2.glb";
import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, PerspectiveCamera } from "@react-three/drei";
import { AdditiveAnimationBlendMode, LoopOnce } from 'three';
import TWEEN from '@tweenjs/tween.js';

//CSS
import './character.css'

//Animation based on these values
export const morphTargetMap = {
  viseme_aa: { index: 10, value: 0.3, duration: 100 }, 
  viseme_CH: { index: 6, value: 0.3, duration: 100 },  
  viseme_DD: { index: 4, value: 0.3, duration: 100 },
  viseme_E: { index: 11, value: 0.3, duration: 150 },
  viseme_FF: { index: 2, value: 0.3, duration: 100 },
  viseme_I: { index: 12, value: 0.3, duration: 150 },  
  viseme_kk: { index: 5, value: 0.3, duration: 100 },
  viseme_nn: { index: 8, value: 0.3, duration: 100 },
  viseme_O: { index: 13, value: 0.3, duration: 150 },
  viseme_PP: { index: 1, value: 0.3, duration: 100 }, 
  viseme_RR: { index: 9, value: 0.3, duration: 100 },  
  viseme_sil: { index: 0, value: 0.3, duration: 100 },
  viseme_SS: { index: 7, value: 0.3, duration: 100 },
  viseme_TH: { index: 3, value: 0.3, duration: 100 }, 
  viseme_U: { index: 14, value: 0.3, duration: 150 },
};

// Funktion zum Triggern einer Sprach-Animation
let actionRef = null
let mixerRef = null
let lastAnima = 0

// Emotions-Animation Trigger
let tweenRefs = {};

export const setUnsetSpeechTweenAnimation = (phoneme, maxValue, duration, passed_length) => {
  //Testausgabe
  //console.log("Animation getriggert für: ", phoneme)
  //Set Animation
  triggerTweenAnimation(phoneme, maxValue, duration/2)
  //Unset Animation
  setTimeout(() => triggerTweenAnimation(phoneme, 0, duration/2), (passed_length+duration/2));
}

export const setUnsetTweenAnimation = (phoneme, maxValue, duration) => {
  //Set Animation
  triggerTweenAnimation(phoneme, maxValue, duration/2)
  //Unset Animation
  setTimeout(() => triggerTweenAnimation(phoneme, 0, duration/2), (duration/2));
}

export const setUnsetEmotionTweenAnimation = (phoneme, maxValue, duration) => {
  //Set Animation
  triggerTweenAnimation(phoneme, maxValue, duration*0.05)
  //Unset Animation
  setTimeout(() => triggerTweenAnimation(phoneme, 0, duration*0.95), (duration*0.05));
}

export const setTweenAnimation = (phoneme, maxValue, duration) => {
  //Set Animation
  triggerTweenAnimation(phoneme, maxValue, duration/2)
}

export const unsetTweenAnimation = (phoneme, maxValue, duration) => {
  //Unset Animation
  triggerTweenAnimation(phoneme, 0, 2000);
}

export const triggerTweenAnimation = (targetName, value, duration) => {
  if (!tweenRefs[targetName]) {
    console.error(`Target ${targetName} nicht gefunden.`);
    return;
  }

  const { mesh, morphIndex } = tweenRefs[targetName];

  if (mesh.morphTargetInfluences) {
    const startValue = { influence: mesh.morphTargetInfluences[morphIndex] };
    const endValue = { influence: value };

    const tween = new TWEEN.Tween(startValue)
    .to(endValue, duration)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
      mesh.morphTargetInfluences[morphIndex] = startValue.influence;
    })
    .onComplete(() => {
    })
    .start();
  }
};

//Animation triggern
export const triggerAnimation = (animationName, indexOfChar) => {
  console.log(actionRef)

  if(indexOfChar == 0){
    lastAnima = 0
  }
  if(indexOfChar > lastAnima){
    lastAnima = indexOfChar
  }

  if(indexOfChar < lastAnima){
    console.error("Animation passed to fast")
  }

  if (actionRef && actionRef[animationName]) {
    // Ursprünglichen Clip erhalten und duplizieren um paralleles Abspielen zu ermöglichen
    const originalClip = actionRef[animationName].getClip(); 
    const clonedAction = mixerRef.clipAction(originalClip)

    console.log(actionRef[animationName]._clip)
    
    clonedAction.setLoop(LoopOnce, 1)
    clonedAction.setEffectiveWeight(0.5);
    clonedAction.blendMode = AdditiveAnimationBlendMode;
    // Animation neu starten und abspielen
    clonedAction.play(); 
    // Entfernen der geklonten Aktion, wenn sie nicht mehr benötigt wird
    setTimeout(() => {
      clonedAction.stop();
      mixerRef.uncacheAction(clonedAction);
    }, clonedAction.getClip().duration * 1000);
  } 
  else {
    console.error(`Animation "${animationName}" nicht gefunden.`);
  }
};

const My3DModel = () => {
  const modelRefHead = useRef();
  const modelRefTeeth = useRef();
  // 3D-Modell laden
  const { scene, nodes, animations } = useGLTF(usedModel); 
  const { mixer } = useAnimations(animations, scene);
  
  //Animation
  const { actions } = useAnimations(animations, scene);
  
  // Starten der Idle-Animation beim Laden der Szene
  useEffect(() => {
    //Action global speichern
    actionRef = actions;
    mixerRef = mixer;

    // Überprüfen, ob die Idle-Animation vorhanden ist
    if (actions && actions.Idle_Character) { 
      //console.log("Idle_Animation playing")
      // Idle-Animation starten
      actions.Idle_Character.play(); 
    }

    //Blinkanimation triggern
    const blinkingPause = 5000
    const blinkingDuration = 100
    setInterval(function () {
      //console.log("Blinking Animation triggered");
      setUnsetTweenAnimation("eyeBlinkLeft", 1, blinkingDuration);
      setUnsetTweenAnimation("eyeBlinkRight", 1, blinkingDuration);
    }, (blinkingPause + blinkingDuration));    
  }, [actions]);

  //Debugging
  const logMorphTargets = () => {
    const mesh = nodes.Wolf3D_Head;
    if (mesh) {
      //console.log("Morph Targets:", mesh.morphTargetInfluences);
    }
  };
  
  // Überprüfen, ob die Szene geladen ist
  useEffect(() => {
    if (!scene) {
      console.log("Szene noch nicht geladen");
      return;
    }

    const meshHead = nodes.Wolf3D_Head;
    if (meshHead) {
      //Ref auf Kopf-Mesh setzen
      modelRefHead.current = meshHead; 
    } else {
      console.error("Das Mesh 'Wolf3D_Head' wurde nicht gefunden.");
    }
    
    

    Object.keys(meshHead.morphTargetDictionary).forEach(function(emotion, index){
        //console.log("Found: ", emotion, " at ", index);
        //console.log(meshHead.morphTargetDictionary)
      const emotionIndex = meshHead.morphTargetDictionary[emotion];
      if (emotionIndex !== undefined) {
        //console.log(emotion, "Wird den TweenRefs zugefügt.");
        tweenRefs[emotion] = { mesh: meshHead, morphIndex: emotionIndex };
      } else {
        console.error("Morph Target, ", emotion, " nicht gefunden.");
      }
    });

    //Debugging - Alle 500ms ausgeben
    const interval = setInterval(logMorphTargets, 500);
    return () => clearInterval(interval);

  }, [scene, nodes]);

  useEffect(() => {
    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
    };
    // Animation starten
    animate();
  }, []);
  

  return (
    <>
      <primitive
        ref={modelRefHead} 
        object={scene}
        scale={3}
        position={[3.4, -5, 3.5]}
      />
      <primitive
        ref={modelRefTeeth}
        object={scene}
        scale={3}
        position={[3.4, -5, 3.5]}
      />
    </>
  );
};

// Hauptszene mit der Kamera und Beleuchtung
const Scene = () => {

  return (
    <div id="canvas_character">
      <Canvas>
        <PerspectiveCamera
            makeDefault
            position={[0, 0, 7]}
            fov={30}
            near={0.1}
            far={10}
          />
        {/* Beleuchtung */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* OrbitControls, um die Kamera zu steuern */}
        <OrbitControls />

        {/* Mein 3D-Modell innerhalb des Canvas */}
        <My3DModel />
      </Canvas>
    </div>
  );
};

export default Scene;
