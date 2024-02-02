import { useEffect, useRef, useState } from 'react';
import { DownloaderExtension } from './Componets/DownloaderExtension/DownloaderExtension';
import { StaticLinksResult } from './interface';
import { CollectAllStaticLinks } from './utils/CollectAllStaticLinks';
import { ChromeCollectData } from './utils/ChromeCollectData';

const IS_PROD = import.meta.env.PROD;

function App() {
	const testRef = useRef<HTMLIFrameElement>(null!);
	const [staticLinks, setStaticLinks] = useState<StaticLinksResult>(null!);

	useEffect(() => {
		if (IS_PROD) {
			ChromeCollectData(setStaticLinks);
		} else {
			CollectAllStaticLinks(undefined, testRef.current.contentDocument, false).then((res) => {
				setStaticLinks(res);
			});
		}
	}, []);

	return (
		<div className="app">
			{!IS_PROD ? (
				<iframe
					src="HTML_TEST_PAGE/index.html"
					className="test__iframe"
					ref={testRef}
					onLoad={() =>
						CollectAllStaticLinks(undefined, testRef.current.contentDocument, false).then((res) => {
							setStaticLinks(res);
						})
					}
				/>
			) : null}
			<DownloaderExtension staticLinks={staticLinks} />
		</div>
	);
}

export default App;
