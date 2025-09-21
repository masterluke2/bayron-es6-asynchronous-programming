class Student { constructor({id,name,age,course}){ this.id=id; this.name=name; this.age=age; this.course=course; } introduce(){ return `Hi, my name is ${this.name}, I am ${this.age} years old, and I am enrolled in ${this.course}.`; } get over21(){ return this.age>21; } }
class Instructor { constructor({id,name,subject}){ this.id=id; this.name=name; this.subject=subject; } teach(){ return `I am ${this.name} and I teach ${this.subject}.`; } }
class Course { constructor({id,title,description}){ this.id=id; this.title=title; this.description=description; } summary(){ return `${this.title}: ${this.description}`; } }

class DataService {
  static url = "/data/students.json"; // <- this file must exist
  static fetchWithThen(){ return fetch(DataService.url).then(r=>{ if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }); }
  static async fetchWithAsync(){ const r=await fetch(DataService.url); if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }
}

function buildEntities(raw){
  return {
    students: raw.students.map(s=>new Student(s)),
    courses: raw.courses.map(c=>new Course(c)),
    instructors: raw.instructors.map(i=>new Instructor(i))
  };
}
function renderExactOutput({students,courses,instructors}){
  const studentLines = students.map(s=>`- ${s.name} (${s.age}) - ${s.course}${s.over21?" *":""}`);
  const courseLines = courses.map(c=>`- ${c.title}: ${c.description}`);
  const instructorLines = instructors.map(i=>`- ${i.name} - ${i.subject}`);
  const lines = ["Students:",...studentLines,"","Courses:",...courseLines,"","Instructors:",...instructorLines];
  document.getElementById("output").textContent = lines.join("\n");
}
function logRelationships({students,courses,instructors}){
  const byTitle = new Map(courses.map(c=>[c.title,c]));
  console.log("Part 4 — Student → Course → Description");
  students.forEach(s=>{
    const c = byTitle.get(s.course);
    console.log(`${s.name} → ${s.course} → ${c?c.description:"N/A"}`);
  });
  const preferred = new Map([
    ["Computer Science","John Rey Silverio"],
    ["Information Technology","Carlos Dela Cruz"],
    ["Software Engineering","John Rey Silverio"],
    ["Data Science","Maria Santos"],
    ["Cybersecurity","Carlos Dela Cruz"]
  ]);
  const byName = new Map(instructors.map(i=>[i.name,i]));
  console.log("Part 4 — Course → Taught by Instructor");
  courses.forEach(c=>{
    const name = preferred.get(c.title) || instructors[0].name;
    console.log(`${c.title} → Taught by ${byName.get(name)?.name || instructors[0].name}`);
  });
}

(function main(){
  // Show something immediately so you know JS is running
  document.getElementById("output").textContent = "Loading...";
  DataService.fetchWithThen()
    .then(d=>console.log("(.then) data:", d))
    .catch(e=>console.error("(.then) error:", e));

  (async()=>{
    try{
      const data = await DataService.fetchWithAsync();
      const entities = buildEntities(data);
      renderExactOutput(entities);
      logRelationships(entities); // console only
    }catch(err){
      console.error(err);
      document.getElementById("output").textContent = `Failed to load data: ${err.message}`;
    }
  })();
})();