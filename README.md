### Documentation

- for styling purpose Tailwind css is used you can visit tailwindcss.com to get reference

## Image Slider Component

- This compenent render a image slider. Which will work with a good smooth animation.
- Images that to be displayed is stored in an array. In which this component will have a timing method in useEffect hook which continuously change the current image and the current image index is stored in a state so it will affect the view for every changes.
- Each image is divided into another subcomponent which is state less to make it more cleaner.

## Daily Essentials

- This component is used to show our daily essential products.
- Products component contain image name and category of every products.

## Brands Cards

- This compoent is used to show the user the most famous brand that our company provides.
- Each brand was created with brandLogo component
- Every logo will displayed by Brands component where there is a state that keep track of selected logo. the selected logo is bigger in size then others.
- when user select a logo that logo will be displayed in center with a smooth animation.
