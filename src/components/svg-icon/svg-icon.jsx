export default function SvgIcon({ className, accessKey }) {
  return (
    <svg className={className}>
      <use xlinkHref={`/fnr-assets.svg#${accessKey}`}></use>
    </svg>
  );
}
