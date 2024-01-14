import { ReactElement, createContext, useContext } from 'react';
import { FilterContextType } from '../../interface';

const FilterContext = createContext<FilterContextType>(null!);
const useFilterContext = (): FilterContextType => useContext(FilterContext);

function FilterContextElement({ children, value }: { children: ReactElement; value: FilterContextType }): ReactElement {
	return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export { useFilterContext, FilterContextElement };
