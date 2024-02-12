// Fetch data from the provided URL
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(data => {
    const dataset = data;

    // Set up SVG dimensions
    const svgWidth = 800;
    const svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select('body')
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create x and y scales
    const xScale = d3.scaleLinear()
      .domain([d3.min(dataset, d => d.Year - 1), d3.max(dataset, d => d.Year + 1)])
      .range([0, width]);

    const yScale = d3.scaleTime()
      .domain(d3.extent(dataset, d => new Date(d.Seconds * 1000)))
      .range([height, 0]);

    // Create x and y axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    // Append x and y axes to the chart
    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('g')
      .attr('id', 'y-axis')
      .call(yAxis);

    // Create dots
    svg.selectAll('.dot')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => new Date(d.Seconds * 1000))
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(new Date(d.Seconds * 1000)))
      .attr('r', 6)
      .on('mouseover', d => {
        // Show tooltip on mouseover
        const tooltip = d3.select('#tooltip');
        tooltip.style('display', 'block')
          .attr('data-year', d.Year)
          .html(`<strong>Year:</strong> ${d.Year}<br><strong>Time:</strong> ${d.Time}<br><strong>Name:</strong> ${d.Name}<br><strong>Nationality:</strong> ${d.Nationality}<br><strong>Doping:</strong> ${d.Doping || 'No doping allegations'}`);
      })
      .on('mouseout', () => {
        // Hide tooltip on mouseout
        d3.select('#tooltip').style('display', 'none');
      });

    // Add legend
    svg.append('text')
      .attr('x', width - 50)
      .attr('y', height - 10)
      .attr('class', 'legend')
      .attr('id', 'legend')
      .text('Riders with doping allegations');
  })
  .catch(error => console.error('Error loading data:', error));
