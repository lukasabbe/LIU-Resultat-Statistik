import { useState, useEffect } from "react";
import SearchDropdown from "./SearchDropdown";
import CircleChart from "./CircleChart";

export default function InteractiveArea() {
  const [selected, setSelected] = useState(null);
  const [modules, setModules] = useState([]);
    const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selected) {
      setModules([]);
      setName("");
      return;
    }
    setLoading(true);
    fetch(`https://liutentor.lukasabbe.com/api/courses/${selected}`)
      .then((response) => response.json())
      .then((data) => {
        setModules(data.modules || []);
        setName(data.courseNameSwe	 || "");
      })
      .catch((error) => {
        console.error("Error fetching course data:", error);
        setModules([]);
        setName("");
      })
      .finally(() => setLoading(false));
  }, [selected]);

return (
    <>
      <div className="middle">
        <SearchDropdown onSelect={setSelected} />
      </div>
      {loading && <div>Loading diagrams...</div>}
      {!loading && modules.length > 0 && (
        <>
          <h2 style={{ textAlign: "center", marginTop: "32px" }}>{name}</h2>
          <div className="circle-grid">
            {modules.map((courseModuleData, idx) => (
              <CircleChart key={idx} course={courseModuleData} />
            ))}
          </div>
        </>
      )}
      <style>{`
        .circle-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          justify-items: center;
          margin-top: 32px;
        }
        @media (max-width: 900px) {
          .circle-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
        @media (max-width: 600px) {
          .circle-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
        @media (max-width: 600px) {
          .circle-grid > div {
            width: 100% !important;
            max-width: 350px;
          }
        }
      `}</style>
    </>
  );
}