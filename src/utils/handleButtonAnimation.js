export default function handleButtonAnimation(
  event,
  classname = 'shadow-drop-2-center'
) {
  const element = event.currentTarget;
  element.classList.remove(classname); // reset animation
  void element.offsetWidth; // trigger reflow
  element.classList.add(classname); // start animation
}
