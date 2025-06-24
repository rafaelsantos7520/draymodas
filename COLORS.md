# Sistema de Cores - Dray Modas

Este documento explica o sistema de cores implementado no projeto Dray Modas, que utiliza variáveis CSS para facilitar a manutenção e mudanças futuras.

## Variáveis CSS Principais

### Cores da Marca

- `--brand-primary`: Cor principal da marca (rosa)
- `--brand-primary-light`: Versão mais clara da cor principal
- `--brand-primary-dark`: Versão mais escura da cor principal

### Tons de Rosa Customizados

- `--pink-50` a `--pink-950`: Escala completa de tons de rosa
- Cada tom tem sua versão para modo claro e escuro

## Como Usar

### 1. Classes Tailwind Customizadas

```tsx
// Cor principal da marca
className = "text-brand-primary";
className = "bg-brand-primary";
className = "border-brand-primary";

// Versões da cor principal
className = "text-brand-primary-light";
className = "bg-brand-primary-dark";

// Tons de rosa específicos
className = "text-pink-100";
className = "bg-pink-200";
className = "border-pink-300";
```

### 2. Variáveis CSS Diretas

```css
/* Em arquivos CSS */
.my-element {
  color: hsl(var(--brand-primary));
  background-color: hsl(var(--pink-100));
  border-color: hsl(var(--pink-200));
}
```

## Modo Escuro

O sistema suporta automaticamente modo escuro. As variáveis são definidas tanto para `:root` (modo claro) quanto para `.dark` (modo escuro).

## Mudando as Cores

Para alterar as cores do projeto, edite as variáveis no arquivo `app/globals.css`:

```css
:root {
  --brand-primary: 330 30% 50%; /* Altere aqui para mudar a cor principal */
  --pink-500: 330 40% 55%; /* Altere aqui para mudar o tom pink-500 */
}
```

## Componentes Atualizados

Os seguintes componentes foram atualizados para usar o novo sistema:

- ✅ PromotionalBanner
- ✅ StoreBanner
- ✅ CategoryGrid
- ✅ BestSellers
- ✅ FeaturedProducts
- ✅ ProductCard
- ✅ ProductDetails
- ✅ RelatedProducts
- ✅ NavbarCliente
- ✅ Página do Catálogo

## Benefícios

1. **Manutenibilidade**: Mudanças de cor centralizadas
2. **Consistência**: Uso padronizado de cores em todo o projeto
3. **Flexibilidade**: Fácil adaptação para diferentes temas
4. **Modo Escuro**: Suporte nativo para tema escuro
5. **Performance**: Variáveis CSS são mais eficientes que classes hardcoded

## Exemplos de Uso

### Botões

```tsx
// Botão primário
<Button className="bg-brand-primary hover:bg-brand-primary-dark text-white">
  Comprar Agora
</Button>

// Botão secundário
<Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-pink-50">
  Ver Detalhes
</Button>
```

### Textos

```tsx
// Título com cor da marca
<h1 className="text-brand-primary font-bold">Dray Modas</h1>

// Preço destacado
<p className="text-brand-primary font-bold">R$ 99,90</p>
```

### Badges

```tsx
// Badge de destaque
<Badge className="bg-brand-primary/90 text-white">
  Novo
</Badge>

// Badge secundário
<Badge className="bg-pink-100 text-pink-700 border-pink-200">
  Oferta
</Badge>
```
