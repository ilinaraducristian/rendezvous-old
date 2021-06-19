import {ComponentProps, FC} from "react";

/**
 * @author Radovan Stevanovic
 * @link https://medium.com/front-end-weekly/how-to-combine-context-providers-for-cleaner-react-code-9ed24f20225e
 * @param components
 */
export const combineContexts = (...components: FC[]): FC => {
  return components.reduce(
      (AccumulatedComponents, CurrentComponent) => {
        return ({children}: ComponentProps<FC>): JSX.Element => {
          return (
              <AccumulatedComponents>
                <CurrentComponent>{children}</CurrentComponent>
              </AccumulatedComponents>
          );
        };
      },
      ({children}) => <>{children}</>,
  );
};