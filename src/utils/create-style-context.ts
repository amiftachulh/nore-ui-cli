export const createStyleContext = `"use client";

import { createContext, useContext, type JSX } from "react";
import { cx } from "styled-system/css";
import { isCssProperty, styled, type StyledComponent } from "styled-system/jsx";

type Props = Record<string, unknown>;
type Recipe = {
  __name__?: string;
  (props?: Props): Props;
  splitVariantProps: (props: Props) => [Props, Props];
};
type Slot<R extends Recipe> = keyof ReturnType<R>;
type Options = { forwardProps?: string[] };

type VariantProps<R extends Recipe> = Parameters<R>[0] extends infer P ? P : never;

const shouldForwardProp = (prop: string, variantKeys: string[], options: Options = {}) =>
  options.forwardProps?.includes(prop) || (!variantKeys.includes(prop) && !isCssProperty(prop));

export const createStyleContext = <R extends Recipe>(recipe: R) => {
  const StyleContext = createContext<Record<Slot<R>, string> | null>(null);

  function withRootProvider<T extends React.ComponentType<any>>(Component: T) {
    const StyledComponent = (props: React.ComponentProps<T> & VariantProps<R>) => {
      const [variantProps, otherProps] = recipe.splitVariantProps(props);
      const slotStyles = recipe(variantProps) as Record<Slot<R>, string>;

      return (
        <StyleContext value={slotStyles}>
          <Component {...(otherProps as React.ComponentProps<T>)} />
        </StyleContext>
      );
    };

    StyledComponent.displayName = toCapitalize(recipe.__name__ || "Component");
    return StyledComponent;
  }

  function withProvider<T extends React.ComponentType<any> | keyof JSX.IntrinsicElements>(
    Component: T,
    slot: Slot<R>,
    options?: Options
  ) {
    const StyledComponent = styled(
      Component,
      {},
      {
        shouldForwardProp: (prop, variantKeys) => shouldForwardProp(prop, variantKeys, options),
      }
    ) as StyledComponent<T>;

    function StyledSlotProvider({
      className,
      ...props
    }: React.ComponentProps<typeof StyledComponent> & VariantProps<R>) {
      const [variantProps, otherProps] = recipe.splitVariantProps(props);
      const slotStyles = recipe(variantProps) as Record<Slot<R>, string>;

      return (
        <StyleContext value={slotStyles}>
          <StyledComponent
            className={cx(slotStyles[slot], className)}
            {...(otherProps as React.ComponentProps<T>)}
          />
        </StyleContext>
      );
    }

    StyledSlotProvider.displayName = \`\${toCapitalize(recipe.__name__ || "Component")}\${toCapitalize(String(slot))}\`;
    return StyledSlotProvider;
  }

  function withContext<T extends React.ComponentType<any> | keyof JSX.IntrinsicElements>(
    Component: T,
    slot: Slot<R>
  ) {
    const StyledComponent = styled(Component);

    function StyledSlotComponent({
      className,
      ...props
    }: React.ComponentProps<typeof StyledComponent>) {
      const slotStyles = useContext(StyleContext);
      return (
        <StyledComponent
          className={cx(slotStyles?.[slot], className)}
          {...(props as React.ComponentProps<T>)}
        />
      );
    }

    StyledSlotComponent.displayName = \`\${toCapitalize(recipe.__name__ || "Component")}\${toCapitalize(String(slot))}\`;

    return StyledSlotComponent;
  }

  return {
    withRootProvider,
    withProvider,
    withContext,
  };
};

function toCapitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
`;
