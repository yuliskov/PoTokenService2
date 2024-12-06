/* eslint-disable */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// dist/index.js
var dist_exports = {};
__export(dist_exports, {
  BASE_URL: () => BASE_URL,
  BG: () => core_exports,
  BGError: () => BGError,
  GOOG_API_KEY: () => GOOG_API_KEY,
  USER_AGENT: () => USER_AGENT,
  base64ToU8: () => base64ToU8,
  default: () => dist_default,
  u8ToBase64: () => u8ToBase64
});
module.exports = __toCommonJS(dist_exports);

// dist/core/index.js
var core_exports = {};
__export(core_exports, {
  Challenge: () => challenge_exports,
  PoToken: () => potoken_exports
});

// dist/core/challenge.js
var challenge_exports = {};
__export(challenge_exports, {
  create: () => create,
  descramble: () => descramble,
  parseChallengeData: () => parseChallengeData
});

// dist/utils/helpers.js
var base64urlCharRegex = /[-_.]/g;
var base64urlToBase64Map = {
  "-": "+",
  _: "/",
  ".": "="
};
function base64ToU8(base64) {
  let base64Mod;
  if (base64urlCharRegex.test(base64)) {
    base64Mod = base64.replace(base64urlCharRegex, function(match) {
      return base64urlToBase64Map[match];
    });
  } else {
    base64Mod = base64;
  }
  base64Mod = atob(base64Mod);
  const result = new Uint8Array([...base64Mod].map((char) => char.charCodeAt(0)));
  return result;
}
function u8ToBase64(u8, base64url = false) {
  const result = btoa(String.fromCharCode(...u8));
  if (base64url) {
    return result.replace(/\+/g, "-").replace(/\//g, "_");
  }
  return result;
}
var BGError = class {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
};

// dist/utils/constants.js
var BASE_URL = "https://jnn-pa.googleapis.com";
var GOOG_API_KEY = "AIzaSyDyT5W0Jh49F30Pqqtyfdf7pDLFKLJoAnw";
var USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36(KHTML, like Gecko)";

// dist/core/challenge.js
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function create(bgConfig, interpreterHash) {
  return __awaiter(this, void 0, void 0, function* () {
    const requestKey = bgConfig.requestKey;
    if (!requestKey)
      throw new BGError(0, "[Challenge]: Request key not provided");
    if (!bgConfig.fetch)
      throw new BGError(1, "[Challenge]: Fetch function not provided");
    const payload = [requestKey];
    if (interpreterHash)
      payload.push(interpreterHash);
    const response = yield bgConfig.fetch(new URL("/$rpc/google.internal.waa.v1.Waa/Create", BASE_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json+protobuf",
        "User-Agent": USER_AGENT,
        "X-Goog-Api-Key": GOOG_API_KEY,
        "X-User-Agent": "grpc-web-javascript/0.1"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok)
      throw new BGError(2, `[Challenge]: Failed to fetch challenge: ${response.status}`);
    const rawData = yield response.json();
    return parseChallengeData(rawData);
  });
}
function parseChallengeData(rawData) {
  let challengeData = [];
  if (rawData.length > 1 && typeof rawData[1] === "string") {
    const descrambled = descramble(rawData[1]);
    challengeData = JSON.parse(descrambled || "[]");
  } else if (rawData.length && typeof rawData[0] === "object") {
    challengeData = rawData[0];
  }
  const [messageId, wrappedScript, , interpreterHash, program, globalName, , clientExperimentsStateBlob] = challengeData;
  const privateDoNotAccessOrElseSafeScriptWrappedValue = Array.isArray(wrappedScript) ? wrappedScript.find((value) => value && typeof value === "string") : null;
  return {
    messageId,
    interpreterJavascript: {
      privateDoNotAccessOrElseSafeScriptWrappedValue
    },
    interpreterHash,
    program,
    globalName,
    clientExperimentsStateBlob
  };
}
function descramble(scrambledChallenge) {
  const buffer = base64ToU8(scrambledChallenge);
  if (buffer.length)
    return new TextDecoder().decode(buffer.map((b) => b + 97));
}

// dist/core/potoken.js
var potoken_exports = {};
__export(potoken_exports, {
  decodePlaceholder: () => decodePlaceholder,
  generate: () => generate,
  generatePlaceholder: () => generatePlaceholder
});
var __awaiter2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function generate(args) {
  return __awaiter2(this, void 0, void 0, function* () {
    var _a, _b;
    const { program, bgConfig, globalName } = args;
    const { identifier } = bgConfig;
    const bgResult = yield invokeBotguard(program, globalName, bgConfig);
    if (bgResult.postProcessFunctions.length) {
      const processIntegrityToken = bgResult.postProcessFunctions[0];
      if (!processIntegrityToken)
        throw new BGError(4, "PMD:Undefined");
      const acquirePo = yield processIntegrityToken(base64ToU8((_b = (_a = bgResult.integrityTokenData.integrityToken) !== null && _a !== void 0 ? _a : bgResult.integrityTokenData.websafeFallbackToken) !== null && _b !== void 0 ? _b : ""));
      if (typeof acquirePo !== "function")
        throw new BGError(16, "APF:Failed");
      const result = yield acquirePo(new TextEncoder().encode(identifier));
      if (!result)
        throw new BGError(17, "YNJ:Undefined");
      if (!(result instanceof Uint8Array))
        throw new BGError(18, "ODM:Invalid");
      return {
        poToken: u8ToBase64(result, true),
        integrityTokenData: bgResult.integrityTokenData
      };
    }
    throw new BGError(0, "[BG]: Failed to process integrity token data");
  });
}
function invokeBotguard(program, globalName, bgConfig) {
  return __awaiter2(this, void 0, void 0, function* () {
    const vm = bgConfig.globalObj[globalName];
    const requestKey = bgConfig.requestKey;
    if (!vm)
      throw new BGError(1, "[BG]: VM not found in the global object");
    if (!requestKey)
      throw new BGError(1, "[BG]: Request key not provided");
    if (!bgConfig.fetch)
      throw new BGError(1, "[BG]: Fetch function not provided");
    const attFunctions = {};
    const setAttFunctions = (fn1, fn2, fn3, fn4) => {
      Object.assign(attFunctions, { fn1, fn2, fn3, fn4 });
    };
    if (!vm.a)
      throw new BGError(2, "[BG]: Init failed");
    try {
      yield vm.a(program, setAttFunctions, true, void 0, () => {
      });
    } catch (err) {
      throw new BGError(3, `[BG]: Failed to load program: ${err.message}`);
    }
    if (!attFunctions.fn1)
      throw new BGError(4, "[BG]: Att function unavailable. Cannot proceed.");
    let botguardResponse;
    const postProcessFunctions = [];
    yield attFunctions.fn1((response) => botguardResponse = response, [, , postProcessFunctions]);
    if (!botguardResponse)
      throw new BGError(5, "[BG]: No response");
    if (!postProcessFunctions.length)
      throw new BGError(6, "[BG]: Got response but no post-process functions");
    const payload = [requestKey, botguardResponse];
    const integrityTokenResponse = yield bgConfig.fetch(new URL("/$rpc/google.internal.waa.v1.Waa/GenerateIT", BASE_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json+protobuf",
        "x-goog-api-key": GOOG_API_KEY,
        "x-user-agent": "grpc-web-javascript/0.1",
        "User-Agent": USER_AGENT,
        "Accept": "*/*"
      },
      body: JSON.stringify(payload)
    });
    if (!integrityTokenResponse.ok)
      throw new BGError(7, "[GenerateIT]: Failed to generate integrity token");
    const integrityTokenData = yield integrityTokenResponse.json();
    if (!integrityTokenData.length)
      throw new BGError(8, "[GenerateIT]: No integrity token data received");
    const [integrityToken, estimatedTtlSecs, mintRefreshThreshold, websafeFallbackToken] = integrityTokenData;
    if (integrityToken !== void 0 && typeof integrityToken !== "string")
      throw new BGError(9, "[GenerateIT]: Invalid integrity token");
    if (estimatedTtlSecs !== void 0 && typeof estimatedTtlSecs !== "number")
      throw new BGError(10, "[GenerateIT]: Invalid TTL");
    if (mintRefreshThreshold !== void 0 && typeof mintRefreshThreshold !== "number")
      throw new BGError(11, "[GenerateIT]: Invalid mint refresh threshold");
    if (websafeFallbackToken !== void 0 && typeof websafeFallbackToken !== "string")
      throw new BGError(12, "[GenerateIT]: Invalid websafe fallback token");
    return {
      integrityTokenData: {
        integrityToken,
        estimatedTtlSecs,
        mintRefreshThreshold,
        websafeFallbackToken
      },
      postProcessFunctions
    };
  });
}
function generatePlaceholder(identifier, clientState) {
  const encodedIdentifier = new TextEncoder().encode(identifier);
  if (encodedIdentifier.length > 118)
    throw new BGError(19, "DFO:Invalid");
  const timestamp = Math.floor(Date.now() / 1e3);
  const randomKeys = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
  const header = randomKeys.concat([
    0,
    clientState !== null && clientState !== void 0 ? clientState : 1
  ], [
    timestamp >> 24 & 255,
    timestamp >> 16 & 255,
    timestamp >> 8 & 255,
    timestamp & 255
  ]);
  const packet = new Uint8Array(2 + header.length + encodedIdentifier.length);
  packet[0] = 34;
  packet[1] = header.length + encodedIdentifier.length;
  packet.set(header, 2);
  packet.set(encodedIdentifier, 2 + header.length);
  const payload = packet.subarray(2);
  const keyLength = randomKeys.length;
  for (let i = keyLength; i < payload.length; i++) {
    payload[i] ^= payload[i % keyLength];
  }
  return u8ToBase64(packet, true);
}
function decodePlaceholder(placeholder) {
  const packet = base64ToU8(placeholder);
  const payloadLength = packet[1];
  const totalPacketLength = 2 + payloadLength;
  if (packet.length !== totalPacketLength)
    throw new Error("Invalid packet length.");
  const payload = packet.subarray(2);
  const keyLength = 2;
  for (let i = keyLength; i < payload.length; ++i) {
    payload[i] ^= payload[i % keyLength];
  }
  const keys = [payload[0], payload[1]];
  const unknownVal = payload[2];
  const clientState = payload[3];
  const timestamp = payload[4] << 24 | payload[5] << 16 | payload[6] << 8 | payload[7];
  const date = new Date(timestamp * 1e3);
  const identifier = new TextDecoder().decode(payload.subarray(8));
  return {
    identifier,
    timestamp,
    unknownVal,
    clientState,
    keys,
    date
  };
}

// dist/index.js
var dist_default = core_exports;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BASE_URL,
  BG,
  BGError,
  GOOG_API_KEY,
  USER_AGENT,
  base64ToU8,
  u8ToBase64
});
//# sourceMappingURL=index.cjs.map
