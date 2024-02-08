import { ReactElement } from 'react';
import { ColumnIcon, GridIcon } from '../../icons';
import { useExtensionStateContext } from '../../ExtensionStateContext/ExtensionStateContext';

function ChangeLayoutButton({}: {}): ReactElement {
	const { dataLayout, setDataLayout } = useExtensionStateContext();
	return (
		<button className="extension__main__head__option__button" onClick={() => setDataLayout(dataLayout === 'column' ? 'grid' : 'column')}>
			{dataLayout === 'column' ? (
				<GridIcon className="extension__main__head__option__button__icon" />
			) : (
				<ColumnIcon className="extension__main__head__option__button__icon" />
			)}
		</button>
	);
}

export { ChangeLayoutButton };
