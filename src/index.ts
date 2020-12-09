import { Firebot } from "firebot-custom-scripts-types";
import { buildEnhancedTtsEffectType } from "./enhanced-tts-effect";

interface Params {}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Enhanced TTS Effect",
      description: "Adds an enhanced TSS effect",
      author: "ebiggz",
      version: "1.3",
      firebotVersion: "5",
      startupOnly: true,
    };
  },
  getDefaultParameters: () => {
    return {};
  },
  run: (runRequest) => {
    const { effectManager, frontendCommunicator } = runRequest.modules;
    const request = (runRequest.modules as any).request;
    effectManager.registerEffect(
      buildEnhancedTtsEffectType(request, frontendCommunicator)
    );
  },
};

export default script;
