import { useRef } from "react";

export default function Settings() {
  const settingsRef = useRef<HTMLDialogElement>(null);

  function toggleSettings() {
    if (settingsRef.current) {
      if (settingsRef.current.hasAttribute("open")) {
        settingsRef.current.close();
      } else {
        settingsRef.current.showModal();
      }
    }
  }

  return (
    <>
      <button
        className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white"
        onClick={toggleSettings}
      >
        Settings
      </button>
      <dialog onClick={(e) => {
		if(e.currentTarget === e.target){
			toggleSettings()
		}}} ref={settingsRef}>
		<div className="grid grid-rows-2 justify-items-center gap-3">
            		<h1 className="col-span-2">Settings</h1>
      			<input className="row-start-2" id="dark-mode" type="checkbox" />
          		<label className="row-start-2" htmlFor="dark-mode">Dark Mode</label>
            	</div>
      </dialog>
    </>
  );
}
