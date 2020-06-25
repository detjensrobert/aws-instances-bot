# frozen_string_literal: true

require 'aws-sdk-ec2'
require 'discordrb'
require 'yaml'

CONFIG = YAML.load_file('config.yml')

bot = Discordrb::Commands::CommandBot.new token: CONFIG['token'], prefix: CONFIG['prefix']
ec2 = Aws::EC2::Resource.new # pull config details from default aws-cli / ~/.aws
ec2_client = Aws::EC2::Client.new

bot.command(:start) do |event, name|
  id = CONFIG['instances'][name.to_s]
  next event.message.react '❓' unless id

  puts "Starting #{name} (#{id})"
  i = ec2.instance(id)
  if i.exists?
    if i.state.code == 48  # terminated
      "#{name} is terminated, so you cannot start it"
    else
      i.start
      event.channel.send_embed do |embed|
        embed.title = "Starting #{name}..."
        embed.color = CONFIG['colors']['pending']
      end
      ec2_client.wait_until(:instance_running, instance_ids: [id])
      event.channel.send_embed do |embed|
        embed.title = "#{name} has started"
        embed.color = CONFIG['colors']['running']
      end
    end
  end
end

bot.command(:stop) do |event, name|
  id = CONFIG['instances'][name.to_s]
  next event.message.react '❓' unless id

  puts "Stopping #{name} (#{id})"
  i = ec2.instance(id)
  if i.exists?
    if i.state.code == 48  # terminated
      "#{name} is terminated, so you cannot stop it"
    else
      i.stop
      event.channel.send_embed do |embed|
        embed.title = "Stopping #{name}..."
        embed.color = CONFIG['colors']['stopping']
      end
      ec2_client.wait_until(:instance_stopped, instance_ids: [id])
      event.channel.send_embed do |embed|
        embed.title = "#{name} has stopped"
        embed.color = CONFIG['colors']['stopped']
      end
    end
  else
    event.message.react '❓'
  end
end

bot.command(:status) do |event, name|
  id = CONFIG['instances'][name.to_s]
  next event.message.react '❓' unless id

  puts "Checking status of #{name} (#{id})"
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
