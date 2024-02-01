import useToggle from '../../hooks/useToggle';
import './Dropdown.scss';
import { ReactElement, useEffect, useRef } from 'react';

function Dropdown({ children, header, disabled }: { children?: ReactElement | ReactElement[] | null; header: string; disabled?: boolean }) {
	const [toggled, setToggle] = useToggle();
	const modalContentRef = useRef<HTMLDivElement>(null!);

	useEffect(() => {
		if (toggled === true) {
			const onClick = (e: MouseEvent) => {
				const target = e.target as HTMLElement;
				if (!modalContentRef.current.contains(target)) {
					setToggle(false);
				}
			};
			document.addEventListener('click', onClick);
			return () => document.removeEventListener('click', onClick);
		}
	}, [toggled]);

	return (
		<div className={`modal__wrapper ${disabled ? 'modal__wrapper__disabled' : 'modal__wrapper__enabled'}`} ref={modalContentRef}>
			<button className="modal__toggle__button" onClick={disabled ? undefined : () => setToggle()}>
				<p className="modal__label">{header}</p>
			</button>
			<div className={`modal__content ${toggled ? 'modal__content__active' : ''}`}>{children}</div>
		</div>
	);
}

export default Dropdown;
