import { Button } from '@/components/ui/button.jsx';

function DayGrid() {
  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col border h-full w-80 p-4">
        Controls
        <div>
          <Button onClick={() => console.log('Click!')}>
            Click me!
          </Button>
        </div>
      </div>
      <div className="grow ">
        <div className="flex flex-col h-full">
          <div className="grow p-4">
            Display
          </div>
          <div className="overflow-y-auto p-4 h-80 border  w-full">
            Log
          </div>
        </div>
      </div>

    </div>
  );
}

export default DayGrid;
