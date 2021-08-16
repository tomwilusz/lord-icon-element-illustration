import { AnimationItem, AnimationConfigWithPath, AnimationConfigWithData } from "lottie-web";

/**
 * Interface for animation.
 */
export interface IAnimation {
  /**
   * The animation has been connected.
   */
  connectedCallback(): void;

  /**
   * The animation has been disconnected.
   */
  disconnectedCallback(): void;

  /**
   * Callback for animation enter.
   */
  enter(): void;

  /**
   * Callback for animation leave.
   */
  leave(): void;
}

/**
 * Type for loadAnimation method from Lottie.
 */
 export type LottieLoader = (params: AnimationConfigWithPath | AnimationConfigWithData) => AnimationItem;