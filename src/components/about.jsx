export default function About() {

  return (
    <section
      id="about"
      className="py-24 bg-[#080808]"
    >

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div>

            <p className="text-blue-500 font-semibold mb-4">
              ABOUT ME
            </p>

            <h2 className="text-4xl md:text-5xl font-bold">
              Developer.
              <br />
              Problem Solver.
              <br />
              Creator.
            </h2>

          </div>


          <div>

            <p className="text-gray-400 text-lg leading-relaxed">

              I'm a passionate full-stack developer who
              enjoys turning ideas into real-world digital
              products.

            </p>

            <p className="text-gray-400 text-lg leading-relaxed mt-6">

              My main focus is developing clean, scalable
              and responsive applications using technologies
              such as React, Node.js, Express and MongoDB.

            </p>

            <p className="text-gray-400 text-lg leading-relaxed mt-6">

              I continuously learn new technologies and
              improve my problem-solving skills through
              practical projects.

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}