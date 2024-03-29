import { Firebot, ScriptModules } from "firebot-custom-scripts-types";

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

interface EffectModel {
  text: string;
  voiceName: string;
  customVoiceName: string;
  voiceMode: "selected" | "random" | "custom";
  volume: number;
  audioOutputDevice: any;
}

export function buildEnhancedTtsEffectType(
  request: any,
  frontendCommunicator: ScriptModules["frontendCommunicator"]
) {
  const enhancedTtsEffectType: Firebot.EffectType<EffectModel> = {
    definition: {
      id: "ebiggz:enhanced-tts",
      name: "Enhanced Text-to-Speech",
      description: "Enhanced TTS",
      icon: "fad fa-microphone-alt",
      categories: ["fun"],
      dependencies: [],
      triggers: {
        command: true,
        custom_script: true,
        startup_script: true,
        api: true,
        event: true,
        hotkey: true,
        timer: true,
        counter: true,
        preset: true,
        manual: true,
      },
    },
    optionsTemplate: `
            <eos-container header="Text">
                <textarea ng-model="effect.text" class="form-control" name="text" placeholder="Enter text" rows="4" cols="40" replace-variables menu-position="under"></textarea>
            </eos-container>

            <eos-container header="Voice" pad-top="true">
                <firebot-radios 
                  options="{ selected: 'Selected voice', random: 'Random Voice', custom: 'Custom Voice' }"
                  model="effect.voiceMode"
                  inline="true"
                  style="padding-bottom: 5px;" 
                 />
                <firebot-select
                  ng-if="effect.voiceMode == 'selected'"
                  options="voices"
                  selected="effect.voiceName"
                  on-update="setVoiceName(option)"
                />
                <firebot-input
                  ng-if="effect.voiceMode == 'custom'"
                  model="effect.customVoiceName" 
                  placeholder-text="Enter voice name" 
                />
            </eos-container>
      
            <eos-container header="Volume" pad-top="true">
                <div class="volume-slider-wrapper">
                    <i class="fal fa-volume-down volume-low"></i>
                      <rzslider rz-slider-model="effect.volume" rz-slider-options="{floor: 1, ceil: 10, hideLimitLabels: true, showSelectionBar: true}"></rzslider>
                    <i class="fal fa-volume-up volume-high"></i>
                </div>
            </eos-container>
      
            <eos-audio-output-device effect="effect" pad-top="true"></eos-audio-output-device>
          `,
    optionsController: ($scope) => {
      if ($scope.effect.volume == null) {
        $scope.effect.volume = 10;
      }
      if ($scope.effect.voiceName == null) {
        $scope.effect.voiceName = "Brian";
      }
      if ($scope.effect.voiceMode == null) {
        $scope.effect.voiceMode = "selected";
      }

      $scope.voices = [
        "Brian",
        "Ivy",
        "Justin",
        "Russell",
        "Nicole",
        "Emma",
        "Amy",
        "Joanna",
        "Salli",
        "Kimberly",
        "Kendra",
        "Joey"
      ];

      $scope.setVoiceName = (name: string) => {
        $scope.effect.voiceName = name;
      }
    },
    optionsValidator: (effect) => {
      let errors = [];
      if (effect.text == null || effect.text.length < 1) {
        errors.push("Please input some text.");
      }
      return errors;
    },
    onTriggerEvent: (event) => {
      return new Promise((resolve) => {
        const effect = event.effect;

        const voices = [
          "Brian",
          "Ivy",
          "Justin",
          "Russell",
          "Nicole",
          "Emma",
          "Amy",
          "Joanna",
          "Salli",
          "Kimberly",
          "Kendra",
          "Joey"
        ];

        const voiceMode = effect.voiceMode ?? "selected";
        let voice = (voiceMode == "random" ? voices[getRandomInt(0, voices.length - 1)] : effect.voiceName) || "Brian";
        if(voiceMode === "custom") {
          if(voices.includes(effect.customVoiceName)) {
            voice = effect.customVoiceName;
          } else {
            voice = "Brian";
          }
        }

        request.post(
          "https://streamlabs.com/polly/speak",
          {
            json: {
              service: "Polly",
              voice: voice,
              text: effect.text,
            },
          },
          (error: any, response: any, body: any) => {
            if (error) {
              console.log("failed to get text to speech.", error);
              resolve(true);
            } else {
              (frontendCommunicator as any)
                .fireEventAsync("getSoundDuration", {
                  path: body.speak_url,
                  format: "ogg",
                })
                .then((duration: number) => {
                  renderWindow.webContents.send("playsound", {
                    volume: effect.volume || 10,
                    audioOutputDevice: effect.audioOutputDevice,
                    format: "ogg",
                    filepath: body.speak_url,
                  });
                  wait((duration + 1.5) * 1000).then(() => {
                    resolve(true);
                  });
                });
            }
          }
        );
      });
    },
  };
  return enhancedTtsEffectType;
}
