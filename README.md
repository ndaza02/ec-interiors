# EC Interiors - Interior Design Website

A modern, elegant interior design website inspired by premium furniture showrooms. Built with HTML, CSS, JavaScript, and GSAP animations.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Smooth Animations**: GSAP-powered animations including:
  - Scroll-triggered animations
  - Parallax effects
  - Hover interactions
  - Page load animations
- **Modern UI**: Clean, minimalist design with elegant typography
- **Product Showcase**: Multiple product categories with detailed descriptions
- **Contact Form**: Interactive contact form with validation
- **Mobile Navigation**: Hamburger menu for mobile devices

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Interactive functionality
- **GSAP 3.12**: Advanced animations and ScrollTrigger
- **Google Fonts**: Playfair Display & Inter

## Project Structure

```
interior-design-website/
│
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript and GSAP animations
└── README.md           # Project documentation
```

## Getting Started

1. **Clone or download** this project to your local machine
2. **Open `index.html`** in your web browser
3. That's it! No build process required.

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2c2c2c;
    --secondary-color: #8b7355;
    --accent-color: #d4a574;
    --text-color: #333;
    --light-bg: #f8f6f3;
}
```

### Fonts
Change fonts in the `<head>` section of `index.html` and update the CSS font-family properties.

### Images
Replace the placeholder backgrounds in the `.image-placeholder` classes with actual images:
```css
.hero-img {
    background: url('path/to/your/image.jpg');
    background-size: cover;
    background-position: center;
}
```

## Features Breakdown

### Navigation
- Fixed header with smooth scroll
- Dropdown menu for products
- Mobile-responsive hamburger menu

### Hero Section
- Eye-catching headline
- Call-to-action button
- Animated text reveal

### Product Categories
- Sofas
- Tables
- Chairs
- Beds
- Armchairs
- Coffee Tables
- Lighting
- Interior Accessories

### Animations
- Fade-in effects on scroll
- Parallax scrolling
- Hover scale effects
- Smooth page transitions
- Form input animations

### Contact Section
- Contact information display
- Interactive form with validation
- Animated submission feedback

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized animations using GSAP
- Lazy loading ready
- Minimal dependencies
- Fast load times

## Future Enhancements

- Add actual product images
- Implement product filtering
- Add shopping cart functionality
- Create individual product pages
- Add image galleries
- Implement backend for contact form
- Add customer testimonials section
- Create blog section

## License

This project is open source and available for personal and commercial use.

## Credits

Design inspired by [Interio.lt](https://www.interio.lt/en/)

Built with ❤️ using modern web technologies
