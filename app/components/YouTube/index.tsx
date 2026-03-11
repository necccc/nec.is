import classnames from "classnames";

import css from "./youtube.module.css";

export const YouTube = ({
  src,
  className = "",
  title = "Youtube video player",
}) => (
  <div className={classnames(css.embed, className)}>
    <iframe
      src={src}
      frameBorder="0"
      gesture="media"
      title={title}
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
);
