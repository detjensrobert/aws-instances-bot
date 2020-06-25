# frozen_string_literal: true

require 'aws-sdk-ec2'
require 'discordrb'
require 'yaml'

CONFIG = YAML.load_file('config.yml')

bot = Discordrb::Commands::CommandBot.new token: CONFIG['token'], prefix: CONFIG['prefix']
ec2 = Aws::EC2::Resource.new # pull config details from default aws-cli / ~/.aws

bot.command(:start) do |event, name|
  id = CONFIG['instances'][name.to_s]
  next event.message.react '❓' unless id
  
  puts "Starting #{id}"
  i = ec2.instance(id)
  if i.exists?
    case i.state.code
    when 0 # pending
      "#{name} is pending, so it will be running in a bit"
    when 16  # started
      "#{name} is already started"
    when 48  # terminated
      "#{name} is terminated, so you cannot start it"
    else
      i.start
      "Starting #{name}"
    end
  end
end

bot.command(:stop) do |event, name|
  id = CONFIG['instances'][name.to_s]
  next event.message.react '❓' unless id
  
  puts "Stopping #{id}"
  i = ec2.instance(id)
  if i.exists?
    case i.state.code
    when 48  # terminated
      "#{name} is already terminated, so you cannot stop it"
    when 64  # stopping
      "#{name} is already stopping"
    when 80  # stopped
      "#{name} is already stopped"
    else
      i.stop
      "Stopping #{name}"
    end
  else
    event.message.react '❓'
  end
end

bot.command(:status) do |event, name|
  id = CONFIG['instances'][name.to_s]
  next event.message.react '❓' unless id
  
  puts "Checking status of #{id}"
  i = ec2.instance(id)
  if i.exists?
    event.channel.send_embed do |embed|
      embed.title = "#{name} is #{i.state.name}"
      embed.color = CONFIG['colors'][i.state.name.to_s]
    end
  else
    event.message.react '❓'
  end
end

# Start bot
bot.ready { puts 'Bot is ready.' }
at_exit { bot.stop }
bot.run
