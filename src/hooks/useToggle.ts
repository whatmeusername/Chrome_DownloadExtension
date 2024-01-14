import { useState, useCallback } from 'react';

export default function useToggle(initialState: boolean = false): [boolean, (fixedState?: boolean) => void] {
	const [state, setToggle] = useState<boolean>(initialState);

	const toggle = useCallback((fixedState?: boolean) => setToggle((state) => (fixedState ? fixedState : !state)), []);

	return [state, toggle];
}
