interface StationNavProps {
    output: string | null
}


export default async function StationNavigation({output}: StationNavProps) {
        if (output?.includes("Success")) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          return <div>{output}</div>;  // or your custom passed message
        }
        return (
          <div>
            <p>station failed</p>
            <div>Loading ...</div>
            <p>returning to planet</p>
          </div>
        );
}