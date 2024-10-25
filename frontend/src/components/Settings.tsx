import { useRef } from "react";

export default function Settings() {
	
	const settingsRef = useRef<HTMLDialogElement>(null)

        function toggleSettings(){
                if(settingsRef.current){
                        if (settingsRef.current.hasAttribute("open")){
                                settingsRef.current.close()
                        }
                        else{
                                settingsRef.current.showModal()
                        }
                }
        }
	
  	return (
		<>
			<button className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white" onClick={toggleSettings}>
      				Settings
    			</button>
			<dialog onClick={toggleSettings} ref={settingsRef}>
           	 		<h1>Settings</h1>
       			</dialog>

		</>
 	 );
}
