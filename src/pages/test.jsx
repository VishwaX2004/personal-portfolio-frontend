import { useState } from "react";

export default function TestPage() {

    const [count,setCount] = useState(10)

    return (
        <div className="w-full h-full flex justify-center items-center text-2xl font-semibold ">

            <div className="w-[500px] h-[500px] bg-accent flex justify-center items-center flex-col gap-[20px] rounded-[20px]">

                <button onClick={
                    () => {
                        console.log("Adding")
                        setCount(count + 1) 
                    }
                } className="w-[100px] h-[50px] bg-primary text-accent rounded-[10px]">
                    +
                </button>

                <span className="text-[30px] text-primary font-semibold">
                    {count}
                </span>

                <button onClick={
                    () => {
                        console.log("Subtracting")
                        setCount(count - 1)
                    }
                } className="w-[100px] h-[50px] bg-primary text-accent rounded-[10px]">
                    -
                </button>

            </div>

        </div>
    )

}