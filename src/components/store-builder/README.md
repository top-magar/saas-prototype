# Enhanced Store Builder

A comprehensive, drag-and-drop store builder for creating e-commerce websites with modern UX and enterprise-grade features.

## Features

### 🎨 **Visual Builder**
- Drag-and-drop interface with real-time preview
- Responsive design preview (Desktop, Tablet, Mobile)
- Component-based architecture
- Undo/Redo functionality
- Live editing with instant feedback

### 🧩 **Rich Component Library**
- **Navigation**: Header navigation with logo and menu items
- **Hero Sections**: Eye-catching banners with CTAs
- **Product Displays**: Grid layouts, showcases, and featured products
- **Content Blocks**: Text sections, images, and rich media
- **Social Proof**: Customer reviews, testimonials, trust badges
- **E-commerce**: Shopping cart widgets, checkout forms
- **Marketing**: Newsletter signup, countdown timers, promotions
- **Footer**: Multi-column footers with links and social media

### 🎯 **Pre-built Templates**
- **Fashion Store**: Modern, elegant design for clothing brands
- **Coffee Shop**: Warm, inviting layout for cafes
- **Tech Store**: Sleek design for electronics
- **Minimal Store**: Clean, versatile design for any product
- **Handmade Crafts**: Artistic design for artisan products

### ⚙️ **Advanced Settings**
- **General**: Store information, contact details, branding
- **Design**: Color schemes, typography, custom styling
- **E-commerce**: Payment methods, shipping options, currency
- **SEO**: Meta tags, analytics integration, social media

### 📱 **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimizations
- Device-specific styling options
- Real-time responsive preview

## Architecture

```
store-builder/
├── store-builder.tsx          # Main builder component
├── component-library.tsx      # Draggable components library
├── canvas-area.tsx           # Drop zone and component management
├── properties-panel.tsx      # Component and style editor
├── template-selector.tsx     # Pre-built templates
├── store-settings.tsx        # Global store configuration
├── page-renderer.tsx         # Component rendering engine
├── draggable-component.tsx   # Drag-and-drop wrapper
└── index.ts                  # Exports
```

## Usage

### Basic Implementation

```tsx
import { StoreBuilder } from '@/components/store-builder';

function MyStoreBuilder() {
  const handleSave = (components, settings) => {
    // Save to database
    console.log('Saving store:', { components, settings });
  };

  return (
    <StoreBuilder 
      onSave={handleSave}
      initialComponents={[]}
      initialSettings={{}}
    />
  );
}
```

### Component Structure

```tsx
interface PageComponent {
  id: string;
  type: 'navigation' | 'hero' | 'products' | 'text' | 'image' | 
        'testimonials' | 'cta' | 'footer' | 'product-showcase' | 
        'trust-badges' | 'newsletter' | 'countdown';
  props: Record<string, any>;
  styles: {
    base: Record<string, any>;
    responsive?: {
      mobile?: Record<string, any>;
      tablet?: Record<string, any>;
      desktop?: Record<string, any>;
    };
  };
  children: PageComponent[];
}
```

### Adding Custom Components

1. **Define Component Type**:
```tsx
// Add to PageComponent type union
type: 'navigation' | 'hero' | 'your-component'
```

2. **Add to Component Library**:
```tsx
const componentTemplates: ComponentTemplate[] = [
  {
    id: 'your-component',
    name: 'Your Component',
    icon: <YourIcon className="h-4 w-4" />,
    category: 'Custom',
    description: 'Your custom component',
    template: {
      type: 'your-component',
      props: { /* default props */ },
      styles: { /* default styles */ },
      children: []
    }
  }
];
```

3. **Add Renderer**:
```tsx
// In page-renderer.tsx
case 'your-component':
  return (
    <div key={component.id} style={mergedStyles}>
      {/* Your component JSX */}
    </div>
  );
```

4. **Add Properties Panel**:
```tsx
// In properties-panel.tsx
case 'your-component':
  return (
    <div className="space-y-4">
      {/* Your component properties */}
    </div>
  );
```

## Customization

### Styling
- Components use Tailwind CSS classes
- Custom styles via inline styles object
- Responsive breakpoints: mobile (375px), tablet (768px), desktop (100%)

### Theming
- Primary, secondary, and accent colors
- Typography settings (heading and body fonts)
- Global store settings

### Templates
- Industry-specific designs
- Customizable starting points
- Easy template creation and modification

## Performance

- **Lazy Loading**: Components loaded on demand
- **Optimized Rendering**: Efficient re-renders with React keys
- **Memory Management**: Proper cleanup of drag-and-drop listeners
- **Bundle Splitting**: Modular architecture for smaller bundles

## Security

- **URL Sanitization**: All URLs validated and sanitized
- **XSS Prevention**: Safe HTML rendering
- **Input Validation**: All user inputs validated
- **Safe Defaults**: Fallback values for all properties

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- `react-dnd`: Drag and drop functionality
- `react-dnd-html5-backend`: HTML5 drag and drop backend
- `lucide-react`: Icons
- `tailwindcss`: Styling
- Custom UI components from `@/components/ui`

## Future Enhancements

- [ ] Advanced animations and transitions
- [ ] Custom CSS editor
- [ ] Component marketplace
- [ ] A/B testing integration
- [ ] Advanced SEO tools
- [ ] Multi-language support
- [ ] Advanced e-commerce integrations
- [ ] Real-time collaboration
- [ ] Version history and branching
- [ ] Performance analytics