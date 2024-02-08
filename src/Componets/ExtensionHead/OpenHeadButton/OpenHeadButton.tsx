import { ReactElement } from 'react';
import { MaximizeIcon, MinimizeIcon } from '../../icons';
import { useExtensionStateContext } from '../../ExtensionStateContext/ExtensionStateContext';

function ToggleHeadButton({ isClose }: { isClose: boolean }): ReactElement {
	const { setHeadOpened } = useExtensionStateContext();
	return (
		<button className="extension__main__head__option__button" onClick={() => setHeadOpened(!isClose)}>
			{isClose ? (
				<MinimizeIcon className="extension__main__head__option__button__icon" />
			) : (
				<MaximizeIcon className="extension__main__head__option__button__icon" />
			)}
		</button>
	);
}

export { ToggleHeadButton };
