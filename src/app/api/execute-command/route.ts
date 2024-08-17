import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    let { command } = reqBody;

    console.log('Command received:', command);
    // Remove any prompt characters like `$`
    command = command.replace(/^\$?\s*/, '').trim();

    console.log('Command received:', command);
    
    // Security check - only allow safe commands
    const allowedCommands = ['ls', 'pwd', 'echo', 'cat', 'whoami'];
    const [baseCommand] = command.split(' ');

    console.log('Base command:', baseCommand);

    if (!allowedCommands.includes(baseCommand)) {
      return NextResponse.json({ error: 'Command not allowed' }, { status: 403 });
    }

    // Execute the command
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    return NextResponse.json({ output: stdout }, { status: 200 });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
