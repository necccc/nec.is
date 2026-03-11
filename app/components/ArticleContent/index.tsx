import css from "./article.module.scss";

export const ArticleContent = ({ children }) => (
  <article className={css.article}>{children}</article>
);
