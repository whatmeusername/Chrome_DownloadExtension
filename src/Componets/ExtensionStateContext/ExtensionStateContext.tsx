import { ReactElement, createContext, useContext } from 'react';
import { ExtensionStateContextType } from '../../interface';

const ExtensionStateContext = createContext<ExtensionStateContextType>(null!);
const useExtensionStateContext = (): ExtensionStateContextType => useContext(ExtensionStateContext);

function ExtensionStateContextElement({ children, value }: { children: ReactElement; value: ExtensionStateContextType }): ReactElement {
	return <ExtensionStateContext.Provider value={value}>{children}</ExtensionStateContext.Provider>;
}

export { useExtensionStateContext, ExtensionStateContextElement };
