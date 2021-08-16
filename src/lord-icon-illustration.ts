import { AnimationConfig, AnimationConfigWithData, AnimationItem } from "lottie-web";
import { LottieLoader } from "./interfaces.js";

/**
 * Store loadAnimation from Lottie.
 */
 let LOTTIE_LOADER: LottieLoader|undefined;

const OBSERVED_ATTRIBUTES = [
  "mode",
  "illustration",
  "animation",
  "src-in",
  "src-loop",
  "src-action",
];

type SUPPORTED_ATTRIBUTES =
  | "mode"
  | "illustration"
  | "animation"
  | "src-in"
  | "src-loop"
  | "src-action";

const ELEMENT_STYLE = `
  :host {
    display: inline-flex;
    width: 128px;
    height: 128px;
    align-items: center;
    justify-content: center;
    position: relative;
    vertical-align: middle;
    fill: currentcolor;
    stroke: none;
    overflow: hidden;
  }

  svg {
    pointer-events: none;
    display: block;
  }
`;

export class LordIconIllustration extends HTMLElement {
  static registerLoader(loader: LottieLoader) {
    LOTTIE_LOADER = loader;
  }

  ["src-in"]: string;
  ["src-loop"]: string;
  ["src-action"]: string;

  mode: string;

  animation: string;

  protected isReady: boolean;
  protected isRendered: boolean;
  protected isVisible: boolean;
  protected resumeLoop: boolean;
  protected _illustration: any;

  protected state: {
    playIn?: boolean;
    playAction?: boolean;
  } = {};

  protected root: ShadowRoot;

  protected container!: HTMLElement;
  protected inAnimationContainer!: HTMLElement;
  protected loopAnimationContainer!: HTMLElement;
  protected actionAnimationContainer!: HTMLElement;

  protected loopAnimationPlayer?: AnimationItem;
  protected inAnimationPlayer?: AnimationItem;
  protected actionAnimationPlayer?: AnimationItem;

  protected queueActionAnimationBound: any;

  constructor() {
    super();

    this.mode = "auto";
    this.isReady = false;
    this.isRendered = false;
    this.isVisible = false;
    this.resumeLoop = false;
    this.animation = 'in';

    this.root = this.attachShadow({
      mode: "open",
    });

    this.state = {};
  }

  connectedCallback() {
    if (!this.isReady) {
      this.init();
    } else {
      this.reset();
    }
  }

  disconnectedCallback() {
    this.destroy();
  }

  protected attributeChangedCallback(
    name: SUPPORTED_ATTRIBUTES,
    oldValue: any,
    newValue: any
  ) {
    this[name] = newValue;
  }

  protected illustrationChanged() {
    if (!this.isReady) {
      return;
    }

    this.reset();
  }

  init() {
    if (this.isReady) {
      return;
    }

    this.isReady = true;

    const style = document.createElement("style");
    style.innerHTML = ELEMENT_STYLE;
    this.root.appendChild(style);

    this.container = document.createElement("div");
    this.root.appendChild(this.container);

    this.inAnimationContainer = document.createElement("div");
    this.inAnimationContainer.style.display = "none";
    this.container.appendChild(this.inAnimationContainer);

    this.loopAnimationContainer = document.createElement("div");
    this.loopAnimationContainer.style.display = "none";
    this.container.appendChild(this.loopAnimationContainer);

    this.actionAnimationContainer = document.createElement("div");
    this.actionAnimationContainer.style.display = "none";
    this.container.appendChild(this.actionAnimationContainer);

    this.queueActionAnimationBound = this.queueActionAnimation.bind(this);

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const callback = (entries: any, observer: any) => {
      entries.forEach((entry: any) => {
        this.isVisible = entry.isIntersecting;

        if (entry.isIntersecting) {
          if (!this.isRendered) {
            this.reset();
          } else {
            if (this.resumeLoop) {
              this.loopAnimationPlayer!.goToAndPlay(0);
              this.resumeLoop = false;
            }

            if (this.modes.includes("intersection")) {
              this.queueInAnimation();
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    observer.observe(this);
  }

  destroy() {
    this.removeEventListener("click", this.queueActionAnimationBound);
    this.removeEventListener("mouseenter", this.queueActionAnimationBound);

    this.state = {};

    if (this.inAnimationPlayer) {
      this.inAnimationPlayer.destroy();
      this.inAnimationPlayer = undefined;
    }
    if (this.loopAnimationPlayer) {
      this.loopAnimationPlayer.destroy();
      this.loopAnimationPlayer = undefined;
    }
    if (this.actionAnimationPlayer) {
      this.actionAnimationPlayer.destroy();
      this.actionAnimationPlayer = undefined;
    }
  }

  play() {
    if (!this.isReady) {
      return;
    }

    switch (this.animation) {
    case 'in':
      this.inAnimationContainer!.style.display = "contents";
      this.inAnimationPlayer!.play();
      break;
    case 'loop':
      this.loopAnimationContainer!.style.display = "contents";
      this.loopAnimationPlayer!.play();
      break;
    case 'action':
      this.actionAnimationContainer!.style.display = "contents";
      this.actionAnimationPlayer!.play();
      break;
    }

    this.dispatchEvent(
      new CustomEvent("state", {
        detail: {
          state: this.animation,
        },
      })
    );
  }

  queueInAnimation() {
    this.state.playIn = true;
  }

  queueActionAnimation() {
    this.state.playAction = true;
  }

  async reset() {
    if (
      !this.illustration &&
      !this["src-in"] &&
      !this["src-loop"] &&
      !this["src-action"]
    ) {
      return;
    }

    this.isRendered = true;

    this.destroy();

    const data = await this.illustrationData;

    this.addEventListener("click", this.queueActionAnimationBound);
    this.addEventListener("mouseenter", this.queueActionAnimationBound);

    const baseConfig: Omit<AnimationConfigWithData, 'container'> = {
      renderer: "svg",
      loop: false,
      autoplay: false,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
        progressiveLoad: true,
        hideOnTransparent: false,
      },
    };

    this.inAnimationPlayer = LOTTIE_LOADER!({
      ...baseConfig,
      container: this.inAnimationContainer,
      animationData: data[0],
    });
    this.loopAnimationPlayer = LOTTIE_LOADER!({
      ...baseConfig,
      container: this.loopAnimationContainer,
      animationData: data[1],
    });
    this.actionAnimationPlayer = LOTTIE_LOADER!({
      ...baseConfig,
      container: this.actionAnimationContainer,
      animationData: data[2],
    });

    this.inAnimationPlayer.addEventListener("complete", () => {
      this.inAnimationContainer!.style.display = "none";
      this.loopAnimationContainer!.style.display = "contents";

      this.loopAnimationPlayer!.goToAndPlay(0);
      this.dispatchEvent(
        new CustomEvent("state", {
          detail: {
            state: "loop",
          },
        })
      );
    });

    this.actionAnimationPlayer.addEventListener("complete", () => {
      this.actionAnimationContainer!.style.display = "none";
      this.inAnimationContainer!.style.display = "none";
      this.loopAnimationContainer!.style.display = "contents";

      this.loopAnimationPlayer!.goToAndPlay(0);
      this.dispatchEvent(
        new CustomEvent("state", {
          detail: {
            state: "loop",
          },
        })
      );
    });

    this.loopAnimationPlayer.addEventListener("complete", () => {
      if (this.state.playAction) {
        this.state.playAction = false;

        this.loopAnimationContainer!.style.display = "none";

        this.actionAnimationContainer!.style.display = "contents";
        this.actionAnimationPlayer!.goToAndPlay(0);
        this.dispatchEvent(
          new CustomEvent("state", {
            detail: {
              state: "action",
            },
          })
        );
      } else if (this.state.playIn) {
        this.state.playIn = false;

        this.loopAnimationContainer!.style.display = "none";

        this.inAnimationContainer!.style.display = "contents";
        this.inAnimationPlayer!.goToAndPlay(0);
        this.dispatchEvent(
          new CustomEvent("state", {
            detail: {
              state: "in",
            },
          })
        );
      } else {
        if (this.isVisible) {
          this.loopAnimationPlayer!.goToAndPlay(0);
        } else {
          this.resumeLoop = true;
        }
        this.dispatchEvent(
          new CustomEvent("state", {
            detail: {
              state: "loop",
            },
          })
        );
      }
    });

    if (this.modes.includes("auto")) {
      this.play();
    }
  }

  async loadIllustrationData(url: string) {
    const response = await fetch(url);
    return await response.json();
  }

  get illustrationData() {
    if (
      this.illustration &&
      Array.isArray(this.illustration) &&
      this.illustration.length === 3
    ) {
      return this.illustration;
    }

    return Promise.all([
      this.loadIllustrationData(this["src-in"]),
      this.loadIllustrationData(this["src-loop"]),
      this.loadIllustrationData(this["src-action"]),
    ]);
  }

  get modes() {
    return (this.mode || "").split(",");
  }

  set illustration(v) {
    this._illustration = v;

    this.illustrationChanged();
  }

  get illustration() {
    return this._illustration;
  }

  static get observedAttributes() {
    return OBSERVED_ATTRIBUTES;
  }
}

/**
 * Defines custom element "lord-icon-illustration".
 * @param loader Animation loader.
 */
export function defineLordIconIllustration(loader: LottieLoader) {
  LordIconIllustration.registerLoader(loader);

  if (!customElements.get || !customElements.get('lord-icon-illustration')) {
    customElements.define("lord-icon-illustration", LordIconIllustration);
  }
}
