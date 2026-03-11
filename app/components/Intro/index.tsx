import css from "./intro.module.scss";

export const Intro = ({ children }) => (
  <span className={css.intro}>{children}</span>
);
